$(document).ready(function () {
    recentUpdate();
   
});

function recentUpdate() {
    $.ajax({
        url:
            API_BASE_PATH +
            "/domain/property/get/" +
            API_TOKEN +
            "/" +
            USER_OBJ.user.email,
        contentType: "application/json",
        type: "get",
        success: function (res) {
            rdata = JSON.parse(res.value);

            if (res) {
                if (rdata[0].id) {
                    $(".recenthead").html(
                        `<span onclick="recentUpdate()" style="padding-bottom: 4px; border-bottom: 3px solid #2d2f79bf;">Recently</span>&nbsp;Visited `
                    );
                } else {
                    $(".recenthead").html(
                        `<span onclick="recentUpdate()" style="padding-bottom: 4px; border-bottom: 3px solid #2d2f79bf;">Features</span> `
                    );
                }

                //  rdata.pop()
                rdata.sort(function (x, y) {
                    return y.update_ts - x.update_ts;
                });

                recentcard(rdata);
            }
        },
        error: function (err) {
            console.log("Error in execution");
            var obj = {
                name: USER_OBJ.user.email,
                value: "",
            };
            $.ajax({
                url: API_BASE_PATH + "/domain/property/upsert/" + API_TOKEN,
                data: JSON.stringify(obj),
                contentType: "application/json",
                type: "post",
                success: function (res) {
                    if (res) {
                        $(".recenthead").html(
                            `<span onclick="recentUpdate()" style="padding-bottom: 4px; border-bottom: 3px solid #2d2f79bf;">Featured</span> `
                        );
                    }
                },
                error: function (err) {
                    // console.log("Error in execution");
                },
            });
        },
    });
}

function clickRecent(tabname, tabid, loadmenu, cardno) {
    let newclick = true;
    for (i = 0; i < rdata.length; i++) {
        if (tabid === rdata[i].id) {
            rdata[i].update_ts = Date.now();
            newclick = false;
        }
    }

    if (newclick) {
        var inp = {
            name: tabname,
            id: tabid,
            loadmenu: loadmenu,
            cardno: cardno,
            update_ts: Date.now(),
        };
        rdata.push(inp);
        //   rdata.pop()
    }

    //   rdata.pop()

    var obj = {
        dataType: "VARCHAR",
        format: "AS_IS",
        name: USER_OBJ.user.email,
        value: JSON.stringify(rdata),
    };

    $.ajax({
        url: API_BASE_PATH + "/domain/property/upsert/" + API_TOKEN,
        data: JSON.stringify(obj),
        contentType: "application/json",
        type: "post",
        success: function (res) {
            if (res) {
            }
        },
        error: function (err) {
            console.log("Error in execution");
        },
    });
}

function recentcard(rdata) {
    if (rdata) {
        for (let i = 0; i < (rdata.length >= 10 ? 10 : rdata.length ); i++) {
              if (i >= 0 && i <= 5) {
                $("#recentMenuList").append(
                    ` <div class="col-lg-3 col-md-4 col-sm-6 col-xs-6 homecard" onclick="loadMenu(` +
                    rdata[i].loadmenu +
                    `)">
            <div class="card modules bskp-home-modules"onclick="clickRecent('` +
                    rdata[i].name +
                    `','` +
                    rdata[i].id +
                    `')">
                <div class="bskp-icon-frame">
                    <div class="bskp-Dbg bskp-Dimg` +
                    rdata[i].cardno +
                    `"> </div>
                </div>
                <p class="mt-2"><label class="cardtitle">` +
                    rdata[i].name +
                    `</label></p>
            </div>
        </div>`
                );
            } else if (i > 5 && rdata[i] !== undefined) {
                $("#recentMenuList").append(
                    ` <div class="col-lg-3 more-Hrecent col-md-4 col-sm-6 col-xs-6 homecard" onclick="loadMenu(` +
                    rdata[i].loadmenu +
                    `)">
            <div class="card modules bskp-home-modules"onclick="clickRecent('` +
                    rdata[i].name +
                    `','` +
                    rdata[i].id +
                    `')">
                <div class="bskp-icon-frame">
                    <div class="bskp-Dbg bskp-Dimg` +
                    rdata[i].cardno +
                    `"> </div>
                </div>
                <p class="mt-2"><label class="cardtitle">` +
                    rdata[i].name +
                    `</label></p>
            </div>
        </div>`
                );
            }
       
        }
        $("#recentMenuList")
        .append(`  <div class="col-lg-3 col-md-4 col-sm-6 col-xs-6 Homemore"  style="display: flex; align-items: center;" onclick='Rtogmore($(".recentmore-title").text())'>
 <div class="card modules bskp-home-modules"onclick="" style="padding: 8px; width: 100px; height: 37px;">
     <div class="bskp-icon-frame" style=" height: 24px;padding:3px; text-align: center; width: 24px;">
     <i class="fa fa-angle-down dropR " aria-hidden="true" style="font-size: 18px;"></i> 
     </div>
     <p class="mt-2"><label class="cardtitle recentmore-title ml-2" style="font-size:14px">More...</label></p>
 </div>
</div>`);
        for (let i = 0; i < 5; i++) {
            if (i >= 0 && i <= 2) {
                $("#recentMegaMenuList").append(
                    ` <div class="col-sm-6 col-xs-6 megacard" onclick="loadMenu(` +
                    rdata[i].loadmenu +
                    `)">
     <div class="card modules bskp-home-modules"onclick="clickRecent('` +
                    rdata[i].name +
                    `','` +
                    rdata[i].id +
                    `')" style="padding: 8px 14px;">
         <div class="bskp-icon-frame">
             <div class="bskp-Dbg bskp-Dimg` +
                    rdata[i].cardno +
                    `" style="height: 28px; width: 28px;"> </div>
         </div>
         <p class="mt-2"><label class="cardtitle" style="font-size:12px">` +
                    rdata[i].name +
                    `</label></p>
     </div>
 </div>`
                );
            }
            if (i > 2 && rdata[i] !== undefined) {
                $("#recentMegaMenuList").append(
                    ` <div class="col-sm-6 col-xs-6 more-Mrecent megacard" onclick="loadMenu(` +
                    rdata[i].loadmenu +
                    `)">
        <div class="card modules bskp-home-modules"onclick="clickRecent('` +
                    rdata[i].name +
                    `','` +
                    rdata[i].id +
                    `')" style="padding: 8px 14px;">
            <div class="bskp-icon-frame">
                <div class="bskp-Dbg bskp-Dimg` +
                    rdata[i].cardno +
                    `" style="height: 28px; width: 28px;"> </div>
            </div>
            <p class="mt-2"><label class="cardtitle" style="font-size:12px">` +
                    rdata[i].name +
                    `</label></p>
        </div>
    </div>`
                );
            }
        }
        $("#recentMegaMenuList")
            .append(` <div class="col-sm-6 col-xs-6 Megamore" style="display: flex; align-items: center;" onclick="Mtogmore($('.Megamore-title').text())">
    <div class="card modules mb-2 bskp-home-modules"onclick="" style="padding: 6px 10px;width: 100px; height: 35px;">
    <div class="bskp-icon-frame" style=" height: 24px;padding:3px; text-align: center; width: 24px;">
    <i class="fa fa-angle-down dropR " aria-hidden="true" style="font-size: 18px;"></i> 
    </div>
        <p class="mt-2"><label class="Megamore-title ml-2" style="font-size:12px">More...</label></p>
    </div>
</div>`);
    }
}

function openmegamenu() {
    $("#megaMenu").modal({
        keyboard: false,
    });
   
}
// MEGA SEARCH FUNCTION
var megasearch = {
    init: function (
        search_home, // input id
        searchable_elements, // .megacard - card div 
        searchable_text_class, // .cardtitle  
        head_class // .megdiv - section
    ) {
        $(search_home).keyup(function (e) {
            var query = $(this).val().toLowerCase().trim();
           if (query) {
                $(".sclose").removeClass("d-none");
                $(".Megamore").hide();
                // loop mega section
                $.each($(head_class), function () {
                    var count = 0;
                    var cardcount =0;
                    cardcount = $(this).find(searchable_elements).length;
                // inner loop mega current section    
                    $.each($(this).find(searchable_elements), function () {
                        var title = $(this)
                            .find(searchable_text_class)
                            .text()
                            .toLowerCase();
                       if (title.indexOf(query) == -1) {
                            $(this).hide();
                            count++;
                        } else {
                           $(this).show();
                        }
                    });
                    if(cardcount === count ){
                        $(this).hide()
                    }else{
                        $(this).show()
                    }
               }
                );
            } else {
                $(this).show();
                $(".sclose").addClass("d-none");
                // empty query so show everything
                $(searchable_elements).show();
                $(".megdiv").show();
                $(".Megamore").show();
                $(".more-Mrecent").hide();  // home recent card minimize
                $(".Megamore-title").text("More...");
                $(".Megamore .dropR").removeClass("bskp-angleR");
            }
        });
    },
};

// HOME SEARCH FUNCTION
var btsearch = {
	init: function(search_home, searchable_elements, searchable_text_class) {
		$(search_home).keyup(function(e){
			var query = $(this).val().toLowerCase();
         	if(query){
                $('.sclose').removeClass('d-none')
                $(".Homemore").hide();// home recent More... button 
                // loop through all elements to find match
				$.each($(searchable_elements), function(){
                  var title = $(this).find(searchable_text_class).text().toLowerCase();
                  if(title.indexOf(query) == -1){
						$(this).hide();
					} else {
						$(this).show();
					}
				});
			} else {
                $('.sclose').addClass('d-none')
				// empty query so show cards column everything
				$(searchable_elements).show();
                $(".Homemore").show(); // home recent More... button 
                $(".more-Hrecent").hide();  // home recent card minimize
                $(".recentmore-title").text("More..."); 
                $(".Homemore .dropR").removeClass("bskp-angleR");
			}
		});
	}
}

// INIT
$(function () {
    // USAGE: btsearch.init(('search field element', 'searchable children elements', 'searchable text class');
    btsearch.init('#search_home', '.homecard', '.cardtitle');
    megasearch.init("#search_megahome", ".megacard", ".cardtitle", ".megdiv");
   
});

function Rtogmore(x) {
    $(".more-Hrecent").toggle();
    $(".Homemore .dropR").toggleClass("bskp-angleR"); //toggle arrow
    if (x === "More...") {
        $(".recentmore-title").text("Less");
    } else {
        $(".recentmore-title").text("More...");
    }
}
function Mtogmore(x) {
    $(".more-Mrecent").toggle();
    $(".Megamore .dropR").toggleClass("bskp-angleR");
    if (x === "More...") {
        $(".Megamore-title").text("Less");
    } else {
        $(".Megamore-title").text("More...");
    }
}
function Mrefresh() {
    $(".sclose").addClass("d-none");
    $("#search_megahome").val("");
    $(".megacard").show();
    $(".megdiv").show();
    $(".Megamore").show(); 
    $(".more-Mrecent").hide();
    $(".Megamore-title").text("More..."); 
    $(".Megamore .dropR").removeClass("bskp-angleR");
    
}
function refresh() {
    $('.sclose').addClass('d-none')
    $('#search_home').val('')
    $('.homecard').show();
    $(".Homemore").show();// home recent More... button 
    $(".more-Hrecent").hide();  // home recent card minimize
    $(".recentmore-title").text("More..."); 
    $(".Homemore .dropR").removeClass("bskp-angleR");
}