const predef = require("./tools/predef");
const meta = require("./tools/meta");
const {px, du, op} = require('./tools/graphics');

// Global variables for holding values
// used to reduce size of rectangle
du_x = 1;
message = "";

/******************************************************************
 * Name: silverBullet
 * Parameter: date time value
 * Returns: boolean
 * Description: Function is many if else statements that compares
 * the current time of the candle and decides if it falls into any
 * of the macro times. If so, we return true otherwise false.
 * ****************************************************************/

function silverBullet(date_time_value){

    // London Macro Silver Bullet 3AM
    if (date_time_value.getUTCHours() >= 8 && date_time_value.getUTCHours() <= 9) {
        if(date_time_value.getUTCHours() == 9  && date_time_value.getUTCMinutes() > 0){
            return false;
        }

        du_x = 1;  // set to full length
        message = ""; // blank message only need one
        // This will print a message onlye once at a specific time. This means the chart needs to
        // divide into 36 otherwise we can't see the text. Really only need for lower time frames.
        if(date_time_value.getUTCHours() == 8 && (date_time_value.getUTCMinutes() == 0)){
            message = "London Open SB\n3:00am - 4:00am"
        }
        // If this is the last rectangle to be drawn, we need to reduce size so it does not carry over
        // the max time in higer time frames.
        if (date_time_value.getUTCHours() == 9 && date_time_value.getUTCMinutes() == 0){
            du_x = 0.1;

          }
        // return true
        return true;

            }
    // We basically repeat above over and over for each macro time

    // New York Morning Silver Bullet
        else if (date_time_value.getUTCHours() >= 15 && date_time_value.getUTCHours() <= 16) {
             if(date_time_value.getUTCHours() == 16  && date_time_value.getUTCMinutes() > 0){
               return false;
              }

        du_x = 1;
        message = "";
        if(date_time_value.getUTCHours() == 15 && date_time_value.getUTCMinutes() == 0){
            message = "New York AM SB\n10:00am - 11:00am"
        }

            if((date_time_value.getUTCHours() == 16  && date_time_value.getUTCMinutes() == 0)){
           du_x = 0.01;
            }


        return true;

            }

        // New York Afternoon Silver Bullet
        else if (date_time_value.getUTCHours() >= 19 && date_time_value.getUTCHours() <= 20) {
             if(date_time_value.getUTCHours() == 20  && date_time_value.getUTCMinutes() > 0){
               return false;
           }
        du_x = 1;
        message = "";

            if(date_time_value.getUTCHours() == 19 && date_time_value.getUTCMinutes() == 0){

                message = "New York PM SB\n3:00pm - 4:00pm"
        }
            return true;

            }

            if((date_time_value.getUTCHours() == 20  && date_time_value.getUTCMinutes() == 0)){

            du_x = 1;

              // Keep it fron expanding beyond 10 minutes

             if (date_time_value.getUTCHours() == 15 && date_time_value.getUTCMinutes() == 10){
                du_x = 0.1;
                 }
           return true;
                        }
        else {

            return false;
            }

}


class ImportantTimes {

    init(){

    }

   // built in function for calculator
   map(d) {

       // Create local variable that are constants
        const times = d.timestamp();
       // See if we need to draw, get bool
        const silverDraw= silverBullet(times);
       // These are settings from the menu the user sets
        const rect_color = this.props.rect_color;
        const opc = this.props.transparency;
        const text_color = this.props.text_color;

       // Return statement, will do the drawing.
        return {
            graphics: silverDraw && {
                items: [
                    {
                 tag: 'Shapes',
                 key: 'rects',
                 //the rectangle is a primitve
                 primitives: [{
                         tag: 'Rectangle',
                         position: {
                             x: du(d.index()), // place at time on X
                             y:  op(du(d.low()), '+', du(300)), // start at low of candle, add 300 display units
                         },
                         size: {
                             height: du(-500), //Ensure candle covers the area
                             width: du(du_x) // Size set from above
                         },
                     }
                 ],
                 // Values from user
                 fillStyle: {
                     color: rect_color,
                     opacity: opc,
                 }

     },
               {
                tag: "Text",
                key: "ex",
                   // Sets a zoom factor, too zoomed out text disapears
                conditions: {
                scaleRangeX: { min: 10, max: 100 },
                },
                point: {
                    x: du(d.index()),
                    y: op(du(d.high()), '+', du(-6)),
            },
            text: message,
            style: { fontSize: 20, fontWeight: "bold", fill: text_color },
            textAlignment: "rightMiddle"
               },
            ],
        }
        }
    }
}

//Create the menu
module.exports = {
    name: "Silver Bullet",
    description: "ICT Silver Bullet",
    params: {
        rect_color: predef.paramSpecs.color('#EEE5CD'),
        transparency: predef.paramSpecs.percent(25,1,0,100),
        text_color: predef.paramSpecs.color('#E74430')
    },
    calculator: ImportantTimes,
    tags: ["ICT"],

}
