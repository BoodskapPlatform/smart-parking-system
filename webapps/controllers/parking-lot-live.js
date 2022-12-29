let parking_lots = [];
let garage_arr_list = [];
let selected_garage_id = null;
let max_lot_size = 5500;

$(document).ready(function () {
  parkingReducer("init");
});

function parkingReducer(action) {

  switch (action) {
    case "init":
      onInit();
      break;

    case "setup":
      parkingSetup();
      break;

    case "generate":
      generateSlots();
      break;

    case "render-list":
      renderParkingList();
      break;

    case "reset":
      resetParkingLots();
      break;

    case "refresh":
      window.location.reload();
      break;

    case "calc":
      parkingCalc();
      break;

    case "list-garage":
      getGarageList();
      break;

    case "list-lots":
      getParkingLotsList();
      break;

    case "delete-garage":

    swal({
        title: "Are you sure?",
        text: "Garage ("+($("#garageLoader option:selected").text() ? $("#garageLoader option:selected").text() : "-")+") & Lots will the permanently deleted from the system.",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    })
        .then(function (result) {
            if (result.value) {
                deleteGarage();
            }
        });

      break;

    case "mqtt-init":
      mqttConnect();
      break;

    case "mqtt-listener":
      mqttListen();
      break;
  }
}

function getGarageList() {

  let slug = DOMAIN_KEY.toLowerCase();
  let api = "Parking/garages";
  let method = "post";
  let key = "";
  let token = USER_OBJ["token"];
  let obj = {
    authType: "TOKEN",
  };
  let data = {
    
  };
  loading();
  executeMicroAPI(
    slug,
    api,
    method,
    data,
    key,
    token,
    obj,
    async (status, result) => {
      closeLoading();
      // let data = await searchQueryFormatterNew(result);
      if (status) {
        garage_arr_list = result["values"];
        renderSelect(garage_arr_list, "garageLoader");
      }
    }
  );
}

function getParkingLotsList() {
    
  let slug = DOMAIN_KEY.toLowerCase();
  let api = "Parking/lots";
  let method = "post";
  let key = "";
  let token = USER_OBJ["token"];
  let obj = {
    authType: "TOKEN",
  };

  let data = {
    garage : $("#garageLoader option:selected").text()
  };

  loading();

  executeMicroAPI(
    slug,
    api,
    method,
    data,
    key,
    token,
    obj,
    async (status, result) => {
     
      closeLoading();

      if (status) {
        parking_lots = result["values"];
        if (parking_lots.length > 0) {
            parkingReducer("render-list");
        }
      }
    }
  );
}

function renderSelect(list, id) {

  if (list.length > 0) {

    $("#" + id).show();
    let parkingHtml = ``;

    for (let i = 0; i < list.length; i++) {
      if (list[i]["garage"]) {
        parkingHtml += `<option value="` +list[i]["_id"] +`">` +list[i]["garage"] +`</option>`;
      }
    }

    $("#" + id).html(parkingHtml);
    parkingReducer('list-lots');
    $(".parking-delete-btn").removeClass("d-none");
    $("#" + id).removeClass("d-none");

  } else {
    $(".parking-delete-btn").removeClass("d-none").addClass("d-none");
    $("#" + id).removeClass("d-none").addClass("d-none");
  }
}

function createGarage() {

  let total_no_rows = parseInt($("#total_no_rows").val());
  let each_row_parking_lots = parseInt($("#each_row_parking_lots").val());
  let parkLotWidth = parseInt($("#parkLotWidth").val());
  let parkLotHeight = parseInt($("#parkLotHeight").val());

  if (total_no_rows <= 0 || isNaN(total_no_rows) || total_no_rows === "") {

        errorMsgBorder("Total row count is required!", "total_no_rows");
        return false;

  } else if (each_row_parking_lots <= 0 || isNaN(each_row_parking_lots) || each_row_parking_lots === "") {

    errorMsgBorder("Each row's parking count is required!","each_row_parking_lots");
    return false;

  } else if (parkLotWidth <= 0 || isNaN(parkLotWidth) || parkLotWidth === "") {

    errorMsgBorder("Single area width is required!", "parkLotWidth");
    return false;

  } else if ( parkLotHeight <= 0 || isNaN(parkLotHeight) || parkLotHeight === "") {

    errorMsgBorder("Single area height is required!", "parkLotHeight");
    return false;

  } else {

        let slug = DOMAIN_KEY.toLowerCase();
        let api = "GarageServices/create";
        let method = "post";
        let key = "";
        let token = USER_OBJ["token"];

        let inputObj = {
            cols: parseInt($("#each_row_parking_lots").val()),
            garage: $.trim($("#garageName").val()),
            rows: parseInt($("#total_no_rows").val()),
            total_lots: each_row_parking_lots * total_no_rows,
            img: "",
            single_lot_breath: parseInt($("#parkLotWidth").val()),
            single_lot_length: parseInt($("#parkLotHeight").val()),
            updated_by: USER_OBJ["user"]["email"],
            created_by: USER_OBJ["user"]["email"],
            created_time: new Date().getTime(),
            updated_time: new Date().getTime()
        };

        let obj = {
            authType: "TOKEN",
        };

        let data = {
            req_data: JSON.stringify(inputObj),
        };
        loading();
        executeMicroAPI( slug, api, method, data, key, token, obj, (status, result) => {
          closeLoading();
            if (status) {
                $("#parkingLotArea").modal("hide");
                successMsg("Garage Created Successfully");
                parkingReducer("list-garage");
            } else {
                errorMsgBorder("Garage creation failed");
            }
        }
        );
    }
}

function deleteGarage() {

  let garage_id = $("#garageLoader").val();

  let slug = DOMAIN_KEY.toLowerCase();
    let api = "GarageServices/delete";
    let method = "post";
    let key = "";
    let token = USER_OBJ["token"];

    let obj = {
      authType: "TOKEN",
    };

    let data = {
      id: garage_id,
    };

    loading();

    executeMicroAPI(slug, api, method, data, key, token, obj, (status, result) => {
      closeLoading();
        if (status) {
          $("#parkingLotArea").modal("hide");
          successMsg("Garage Deleted Successfully");
          setTimeout(()=>{
            window.location.reload();
          },2000);
        } else {
          errorMsgBorder("Garage creation failed");
        }
      }
    );
}

function onInit() {
    parkingReducer("list-garage");
    parkingReducer("mqtt-init");
    parkingReducer("mqtt-listener");
}

function parkingCalc() {
  let total_no_rows = parseInt($("#total_no_rows").val());
  let each_row_parking_lots = parseInt($("#each_row_parking_lots").val());
  let tot = total_no_rows * each_row_parking_lots;
  $("#totalParkingLots").html(tot);
}

function parkingSetup() {
  $("#parkingLotArea").modal("show");
  parkingCalc();
}

async function renderParkingList(){

    let oneRow = "";
    let all_park_arr = [];
    let garage_obj = {};

    for(let z=0;z<garage_arr_list.length;z++){
        if(garage_arr_list[z]["_id"] === $("#garageLoader option:selected").val()){
            garage_obj = garage_arr_list[z];
        }
    }

    if(garage_obj.rows > 0 && garage_obj.cols > 0){
        
        let rowArr = [];
        let parking_no = 1;

        for(let y=1;y<=garage_obj.rows;y++){
            let colArr = [];
            for(let x=1;x<=garage_obj.cols;x++){
                let lid= "ROW"+y+"COL"+x;
                let ob = await _.find(parking_lots, function (o) { return o.lot === lid; })
                let carColors = ["yellow", "blue", "white", "red"];
                let carImg = carColors[Math.floor(Math.random() * carColors.length)];

                ob["garage"] = garage_obj["garage"];
                ob["parking_no"] = parking_no;
                ob["status"] = "sp-occupying";
                ob["img"] = carImg;

                colArr.push(ob);
                parking_no++;
            }
            rowArr.push(colArr);
        }

        all_park_arr = rowArr;
        $("#parkingLots").html("");
      
        for (let i = 0; i < all_park_arr.length; i++) {
          
          oneRow += `<h4 style="color: #999999;"><span class="badge text-bg-secondary" style="margin-bottom: 15px;float:left;">
                        <i class="fa fa-map-signs"></i> Row ` +(i + 1) +`</span></h4>`;

                        
          oneRow += `<div style="display:inline-block;vertical-align:top;">`;

          if (i % 2) {  //Road UI
            oneRow += `<div style="background: #00000030; padding: 40px; margin-top: 10px; margin-bottom: 23px; border-radius: 10px;">
                      <div style="border: 5px dashed #ffffff;"></div>
                  </div>`;
          }
      
          for (let j = 0; j < all_park_arr[i].length; j++) {
            let onePark = all_park_arr[i][j];
            // let wdt = "width:"+domWidth;

            let g_uniq_nam = onePark["garage"].replaceAll(" ","_");
            let distance = Math.round(
              parseInt(onePark["distance"]) / (max_lot_size / 100)
            );

            let vehicle_vis = '';
            let park_alert = '';

            //Vehicle in Safe Position
            if (distance <= 5 && distance >= 0) {
              vehicle_vis = 'display:inline;';
              park_alert = 'sp-done';
            }

            //Vehicle in min of the parking area
            if (distance <= 94 && distance >= 6) {
              vehicle_vis = 'display:inline;';
              park_alert = 'sp-inprogress';
            }

            if (distance >= 95) {
              vehicle_vis = 'display:none;';
              park_alert = '';
            }
            
            oneRow +=
              `<div class="sp-slot-one-area garage_`+g_uniq_nam+`" id="lot_`+g_uniq_nam+`_` +onePark["lot"]+`">
                   <div class="sp-slot-label"><i class="fa fa-circle sp-occupying"></i> Lot ` +onePark["parking_no"] +`</div>
                   <div class="sp-lots lot-area `+park_alert+`" style="position:relative;">
                      <img class="sp-vehicle-img" style="`+vehicle_vis+`top:`+distance+`%;" id="parkedVehicle_`+g_uniq_nam+`_`+onePark["lot"] +`" src="images/cars/` +onePark["img"] +`-car.png">
                   </div>
              </div>`;
          }
      
          oneRow += "</div>";
        }
      
        $("#parkingLots").html(oneRow);
    }
}

function resetParkingLots() {
  removeLocStrg("parking_lot");
  removeLocStrg("parking_setup");
  successMsg("Parking setup reset successfully!");
  setTimeout(function () {
    window.location.reload();
  }, 1000);
}

function lotStatusUpdate(payload) {

  let g_uniq_nam = payload["garage"].replaceAll(" ","_");
  let distance = Math.round(
    parseInt(payload["distance"]) / (max_lot_size / 100)
  );
  $("#parkedVehicle_"+g_uniq_nam+"_" + payload["lot"]).css("top", distance + "%");
  $("#parkedVehicle_"+g_uniq_nam).show();

  //Vehicle in Safe Position
  if (distance <= 5 && distance >= 0) {
    $("#lot_"+g_uniq_nam+"_" + payload["lot"] + " .lot-area")
      .removeClass("sp-inprogress")
      .removeClass("sp-done")
      .addClass("sp-done");
    $("#parkedVehicle_"+g_uniq_nam+"_" + payload["lot"]).show();
  }

  //Vehicle in min of the parking area
  if (distance <= 94 && distance >= 6) {
    $("#lot_"+g_uniq_nam+"_" + payload["lot"] + " .lot-area")
      .removeClass("sp-done")
      .removeClass("sp-inprogress")
      .addClass("sp-inprogress");
    $("#parkedVehicle_"+g_uniq_nam+"_" + payload["lot"]).show();
  }

  //Vehicle in away position
  if (distance >= 95) {
    $("#lot_"+g_uniq_nam+"_" + payload["lot"] + " .lot-area")
      .removeClass("sp-done")
      .removeClass("sp-inprogress");
    $("#parkedVehicle_"+g_uniq_nam+"_" + payload["lot"]).hide();
  }
}

// ========================================
// MQTT Lisentner
// ========================================

function mqttListen() {
  if (MQTT_STATUS) {
    console.log(new Date() + " | MQTT Started to Subscribe");

    mqttSubscribe("/" + USER_OBJ.domainKey + "/log/#", 0);

    mqttSubscribe("/global/#", 0);

    if (ADMIN_ACCESS) {
      mqttSubscribe("/system/#", 0);
    }

    mqtt_client.onMessageArrived = function (message) {
      var parsedData = JSON.parse(message.payloadString);
      var topicName = message.destinationName;
      
      if (topicName === "/"+DOMAIN_KEY+"/log/mrule/100") {
        if (parsedData["data"] != "__ALL_DONE__") {
          try{
            let lotObj = JSON.parse(parsedData.data);
            let obj = {
              garage: lotObj.garage,
              gwid: lotObj.deviceid,
              lot: lotObj.lot,
              distance: lotObj.distance,
            };

            lotStatusUpdate(obj);
          }catch(e){}
        }
      }
    };
  }
}

// ========================================
// Local Storage - CRUDs
// ========================================
function getLocStrg(name) {
  if (localStorage.getItem(name) != null) {
    return JSON.parse(localStorage.getItem(name));
  } else {
    return null;
  }
}

function setLocStrg(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

function removeLocStrg(name) {
  localStorage.removeItem(name);
}
