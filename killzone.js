const predef = require("./tools/predef");
const meta = require("./tools/meta");
const {px, du, op} = require('./tools/graphics');

// Global variables for holding values
color = '';
// used to reduce size of rectangle
du_x = 1;
message = "";

/******************************************************************
 * Name: killZone
 * Parameter: date time value
 * Returns: boolean
 * Description: Function is many if else statements that compares
 * the current time of the candle and decides if it falls into any
 * of the macro times. If so, we return true otherwise false.
 * ****************************************************************/

function killZone(date_time_value, asian_color, london_color){

  // London KillZone
        if (date_time_value.getUTCHours() >= 7 && date_time_value.getUTCHours() <= 10) {
             if(date_time_value.getUTCHours() == 10  && date_time_value.getUTCMinutes() > 0){
               return false;
           }
        color = london_color;
        du_x = 1;
        message = "";

            if(date_time_value.getUTCHours() == 7 && date_time_value.getUTCMinutes() == 0){

                message = "London KillZone";
        }
            if((date_time_value.getUTCHours() == 10  && date_time_value.getUTCMinutes() == 0)){
               du_x = 0.01;
           }
            return true;
        }



        // Asian KillZone
        else if (date_time_value.getUTCHours() >= 1 && date_time_value.getUTCHours() <= 5) {
             if(date_time_value.getUTCHours() == 5  && date_time_value.getUTCMinutes() > 0){
               return false;
           }
            color = asian_color;
            du_x = 1;
            message = "";

            if(date_time_value.getUTCHours() == 1 && date_time_value.getUTCMinutes() == 0){

                message = "Asian KillZone";
        }
            if((date_time_value.getUTCHours() === 5  && date_time_value.getUTCMinutes() === 0)){
               du_x = 0.01;
           }
            return true;
        } else {

            return false;
            }

}


class ImportantTimes {

    init(){

    }

   // built in function for calculator
   map(d) {

        // colors
        const asian_color = this.props.asian_color;
        const london_color = this.props.london_color;

       // Create local variable that are constants
        const times = d.timestamp();
       // See if we need to draw, get bool
        const killDraw= killZone(times, asian_color, london_color);
       // These are settings from the menu the user sets


        const opc = this.props.transparency;
        const text_color = this.props.text_color;

       // Return statement, will do the drawing.
        return {
            graphics: killDraw && {
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
                     color: color,
                     opacity: opc,
                 }

     },
               {
                tag: "Text",
                key: "ex",
                   // Sets a zoom factor, too zoomed out text disapears
                conditions: {
                scaleRangeX: { min: 50, max: 500 },
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
    name: "Kill Zone",
    description: "ICT Kill Zones",
    params: {
        london_color: predef.paramSpecs.color('#E74430'),
        asian_color: predef.paramSpecs.color('#AAAD23'),
        transparency: predef.paramSpecs.percent(25,1,0,100),
        text_color: predef.paramSpecs.color('#359D55')
    },
    calculator: ImportantTimes,
    tags: ["ICT"],

}
