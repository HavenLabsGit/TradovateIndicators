const predef = require("./tools/predef");
const meta = require("./tools/meta");
const {px, du, op} = require('./tools/graphics');

// Global variables for holding values
// used to reduce size of rectangle
du_x = 1;
message = "";


function macroRectangles(date_time_value){

    // London Macro 2:33am - 3:00am
    if(date_time_value.getUTCHours() == 7  && date_time_value.getUTCMinutes() >= 33){
        du_x = 1;
        message = "";
        if(date_time_value.getUTCHours() == 7 && (date_time_value.getUTCMinutes() == 36)){
            message = "  London Macro\n2:33am - 3:00am"
        }

        if (date_time_value.getUTCHours() == 8 && date_time_value.getUTCMinutes() == 0){
            du_x = 0.1;

          }
        return true;

            }

    // London Macro 4:03am - 4:30am
    else if(date_time_value.getUTCHours() == 9  && date_time_value.getUTCMinutes() >= 3 && date_time_value.getUTCMinutes() <= 30){

        du_x = 1;
        message = "";
        if(date_time_value.getUTCHours() == 9 && date_time_value.getUTCMinutes() == 3){
            message = "  London Macro\n4:03am - 4:30am"
        }
        if (date_time_value.getUTCMinutes() == 30){
            du_x = 0.1;

        }


        return true;

            }

    // New York Macro 9:50am - 10:10am
    else if(date_time_value.getUTCHours() == 14 && date_time_value.getUTCMinutes() >= 50){
            du_x = 1;
            message = "";
        if(date_time_value.getUTCHours() == 14 && date_time_value.getUTCMinutes() == 54){
            message = "New York AM Macro\n 9:50am - 10:10am"
        }
            return true;

            }

    else if(date_time_value.getUTCHours() == 15 && date_time_value.getUTCMinutes() <= 10){

            du_x = 1;

              // Keep it fron expanding beyond 10 minutes

             if (date_time_value.getUTCHours() == 15 && date_time_value.getUTCMinutes() == 10){
                du_x = 0.1;
                 }
           return true;
                        }


   // New York Macro 10:50am - 11:10am
    else if(date_time_value.getUTCHours() == 15  && date_time_value.getUTCMinutes() >= 50){

        du_x = 1;
        message = "";
        if(date_time_value.getUTCHours() == 15 && date_time_value.getUTCMinutes() == 54){
            message = "New York AM Macro\n 10:50am - 11:10am"
        }
        return true;

            }
    else if(date_time_value.getUTCHours() == 16  && date_time_value.getUTCMinutes() <= 10){

        du_x = 1;

        if (date_time_value.getUTCHours() == 16 && date_time_value.getUTCMinutes() == 10){
            du_x = 0.1;
        }
        return true;
         }


     // New York Lunch 11:50am - 12:10pm
    else if(date_time_value.getUTCHours() == 16  && date_time_value.getUTCMinutes() >= 50){

            du_x = 1;
            message = "";
        if(date_time_value.getUTCHours() == 16 && date_time_value.getUTCMinutes() == 54){
            message = "New York Lunch Macro\n 11:50am - 12:10am"
        }
              return true;

            }
    else if(date_time_value.getUTCHours() == 17  && date_time_value.getUTCMinutes() <= 10){

    du_x = 1;
        if (date_time_value.getUTCHours() == 17 && date_time_value.getUTCMinutes() == 10){
            du_x = 0.1;
        }
        return true;
         }


     // New York PM Macro 1:10pm - 1:40pm
    else if(date_time_value.getUTCHours() == 18  && date_time_value.getUTCMinutes() >= 10 && date_time_value.getUTCMinutes() <= 40){
          du_x = 1;
         message = "";
        if(date_time_value.getUTCHours() == 18 && date_time_value.getUTCMinutes() == 12){
            message = "New York PM Macro\n 1:10pm - 1:40pm"
        }
        if (date_time_value.getUTCMinutes() == 40){
            du_x = 0.1;

         }
        return true;
            }

     // New York PM Macro 3:15pm - 3:45pm
    else if(date_time_value.getUTCHours() == 20  && date_time_value.getUTCMinutes() >= 15 && date_time_value.getUTCMinutes() <= 45){
          du_x = 1;
        message = "";
        if(date_time_value.getUTCHours() == 20 && date_time_value.getUTCMinutes() == 24){
            message = "New York PM Macro\n 3:15pm - 3:45pm"
        }
        if (date_time_value.getUTCMinutes() == 45){
            du_x = 0.1;

         }
        return true;
            }

    else{

        return false;
    }

}


class ImportantTimes {

    init(){

    }

   map(d) {

        const times = d.timestamp();
        const macroDraw = macroRectangles(times);
        const rect_color = this.props.rect_color;
        const opc = this.props.transparency;
        const text_color = this.props.text_color;

        pixel_y = d.low();
       console.log(message);

        return {
            graphics: macroDraw && {
                items: [
                    {
                 tag: 'Shapes',
                 key: 'rects',
                 //the rectangle is a primitve
                 primitives: [{
                         tag: 'Rectangle',
                         position: {
                             x: du(d.index()),
                             y:  op(du(d.low()), '+', du(300)),
                         },
                         size: {
                             height: du(-500),
                             width: du(du_x)
                         },
                     }
                 ],
                 fillStyle: {
                     color: rect_color,
                     opacity: opc,
                 }

     },
               {
                tag: "Text",
                key: "ex",
                conditions: {
                scaleRangeX: { min: 10, max: 100 },
                },
                point: {
                    x: du(d.index()),
                    y: op(du(d.high()), '+', du(-3)),
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


module.exports = {
    name: "ICT Time Macros",
    description: "ICT Time Macros",
    params: {
        rect_color: predef.paramSpecs.color('#538D90'),
        transparency: predef.paramSpecs.percent(25,1,0,100),
        text_color: predef.paramSpecs.color('#E74430')
    },
    calculator: ImportantTimes,
    tags: ["ICT"],

}
