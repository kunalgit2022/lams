
// ------- Equal Height -------
$(document).ready(function(){
    //alert("ready");
    changeDivHeight();
});
/*whenever browser window size changes, this function is being called
  and it fixed div height.*/
$(window).resize(function(){
    //alert("resize");
    changeDivHeight();
});
/*here we place our logic
  we take each sizes, compares which one is largest and then
  set other's height.*/
function changeDivHeight() {
    // .innerHeight() returns height of an element
    var a = $("#div_a").innerHeight();
    var b = $("#div_b").innerHeight();
    //alert(a + " " + b);
    // .height() sets height of an element
    // we can pass an integer value, which will be converted into px
    // otherwise we can pass a string, mentioning the unit such as px or in or cm or dp
    if( a > b ) {
        $("#div_b").height( a );
    } else {
        $("#div_a").height( b );
    }

    var c = $("#div_c").innerHeight();
    var d = $("#div_d").innerHeight();
    //alert(a + " " + b);
    // .height() sets height of an element
    // we can pass an integer value, which will be converted into px
    // otherwise we can pass a string, mentioning the unit such as px or in or cm or dp
    if( c > d ) {
        $("#div_d").height( c );
    } else {
        $("#div_c").height( d );
    }
}


//------------- TREE VIEW WITH CHECKBOX -------------
$(document).ready(function () {
    $(".plus").click(function () {
        $(this).toggleClass("minus").siblings("ul").toggle();
    })

    $("input[type=checkbox]").click(function () {
        //alert($(this).attr("id"));
        //var sp = $(this).attr("id");
        //if (sp.substring(0, 4) === "c_bs" || sp.substring(0, 4) === "c_bf") {
            $(this).siblings("ul").find("input[type=checkbox]").prop('checked', $(this).prop('checked'));
        //}
    })

    $("input[type=checkbox]").change(function () {
        var sp = $(this).attr("id");
        if (sp.substring(0, 4) === "c_io") {
            var ff = $(this).parents("ul[id^=bf_l]").attr("id");
            if ($('#' + ff + ' > li input[type=checkbox]:checked').length == $('#' + ff + ' > li input[type=checkbox]').length) {
                $('#' + ff).siblings("input[type=checkbox]").prop('checked', true);
                check_fst_lvl(ff);
            }
            else {
                $('#' + ff).siblings("input[type=checkbox]").prop("indeterminate", true);
                check_fst_lvl(ff);
            }
        }

        if (sp.substring(0, 4) === "c_bf") {
            var ss = $(this).parents("ul[id^=bs_l]").attr("id");
            if ($('#' + ss + ' > li input[type=checkbox]:checked').length == $('#' + ss + ' > li input[type=checkbox]').length) {
                $('#' + ss).siblings("input[type=checkbox]").prop('checked', true);
                check_fst_lvl(ss);
            }
            else {
                $('#' + ss).siblings("input[type=checkbox]").prop("indeterminate", true);
                check_fst_lvl(ss);
            }
        }
    });

  
    $("input[type=checkbox]").change(function () {
        var sp = $(this).attr("id");
        if (sp.substring(0, 4) === "e_io") {
            var ff = $(this).parents("ul[id^=ef_l]").attr("id");
            if ($('#' + ff + ' > li input[type=checkbox]:checked').length == $('#' + ff + ' > li input[type=checkbox]').length) {
                $('#' + ff).siblings("input[type=checkbox]").prop('checked', true);
                check_fst_lvl(ff);
            }
            else {
                $('#' + ff).siblings("input[type=checkbox]").prop("indeterminate", true);
                check_fst_lvl(ff);
            }
        }

        if (sp.substring(0, 4) === "e_bf") {
            var ss = $(this).parents("ul[id^=es_l]").attr("id");
            if ($('#' + ss + ' > li input[type=checkbox]:checked').length == $('#' + ss + ' > li input[type=checkbox]').length) {
                $('#' + ss).siblings("input[type=checkbox]").prop('checked', true);
                check_fst_lvl(ss);
            }
            else {
                $('#' + ss).siblings("input[type=checkbox]").prop("indeterminate", true);
                check_fst_lvl(ss);
            }
        }
    });

})

function check_fst_lvl(dd) {
    //var ss = $('#' + dd).parents("ul[id^=bs_l]").attr("id");
    var ss = $('#' + dd).parent().closest("ul").attr("id");
    if ($('#' + ss + ' > li input[type=checkbox]:checked').length == $('#' + ss + ' > li input[type=checkbox]').length) {
        //$('#' + ss).siblings("input[id^=c_bs]").prop('checked', true);
        $('#' + ss).siblings("input[type=checkbox]").prop('checked', true);
    }
    else {
        //$('#' + ss).siblings("input[id^=c_bs]").prop('checked', false);
        $('#' + ss).siblings("input[type=checkbox]").prop('checked', false);
    }

}

// function pageLoad() {
//     $(".plus").click(function () {
//         $(this).toggleClass("minus").siblings("ul").toggle();
//     })
// }


//------------- TREE VIEW WITH CHECKBOX INDETERMINATE PROPERTY CLICK / UNCLICK -------------

$(function() {

  $('input[type="checkbox"]').change(checkboxChanged);

  function checkboxChanged() {
    var $this = $(this), // The clicked upon checkbox
        checked = $this.prop("checked"), // The new state of the checbox (true or false)
        container = $this.parent(); // The li container of the checkbox

    container.find('input[type="checkbox"]') // 1. Get all the child checkboxes of the container
    .prop({                                  // 2. Change the properties of all such checkboxes
        indeterminate: false,
        checked: checked
    })
    .siblings('label')                       // 3. Get their corresponding labels
    .removeClass('custom-checked custom-unchecked custom-indeterminate') // 4. Change their CSS classes
    .addClass(checked ? 'custom-checked' : 'custom-unchecked');

    checkSiblings(container, checked);       // Check the siblings of the container
  }

  function checkSiblings($el, checked) { // $el is a li
    var parent = $el.parent().parent(),  // parent is the containing li element
        all = true,
        indeterminate = false;

    $el.siblings().each(function() { // for each li sibling of the current element
      all = all && ($(this).children('input[type="checkbox"]').prop("checked") === checked); 
    });
    
    if (all && checked) {
      parent.children('input[type="checkbox"]')
      .prop({
          indeterminate: false,
          checked: checked
      })
      .siblings('label')
      .removeClass('custom-checked custom-unchecked custom-indeterminate')
      .addClass(checked ? 'custom-checked' : 'custom-unchecked');

      checkSiblings(parent, checked);
    } 
    else if (all && !checked) {
      
      numChecked = parent.children('ul').find('input[type="checkbox"]:checked').length;
      
      indeterminate = numChecked > 0;

      parent.children('input[type="checkbox"]')
      .prop("checked", checked)
      .prop("indeterminate", indeterminate)
      .siblings('label')
      .removeClass('custom-checked custom-unchecked custom-indeterminate')
      .addClass(indeterminate ? 'custom-indeterminate' : (checked ? 'custom-checked' : 'custom-unchecked'));

      checkSiblings(parent, checked);
    } 
    else {
      $el.parents("li").children('input[type="checkbox"]')
      .prop({
          indeterminate: true,
          checked: false
      })
      .siblings('label')
      .removeClass('custom-checked custom-unchecked custom-indeterminate')
      .addClass('custom-indeterminate');
    }
  }
});


//------------- MAP EXTEND TO FULL SCREEN -------------

function toggleFullScreen(elem) {
  if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
    if (elem.requestFullScreen) {
      elem.requestFullScreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullScreen) {
      elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}


//------------- Draggable --------------
(function($) {
    $.fn.drags = function(opt) {

        opt = $.extend({handle:"",cursor:"move"}, opt);

        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                $('.draggable').offset({
                    top:e.pageY + pos_y - drg_h,
                    left:e.pageX + pos_x - drg_w
                }).on("mouseup", function() {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }
})(jQuery);
  
