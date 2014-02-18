$(function(){

var editor_path;
$("script[src*=visedit\\.js]").each(function(){ editor_path = this.src.replace(/visedit.js/,'editor.html'); });

$(".enablevisedit").after('<button type=button class=viseditbut>edit</button>');

if ($("#viseditstyle").length==0) {
  $("<style id=viseditstyle>.viseditcontainer{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#ddd;} .viseditblocker{position:absolute;width:height:100%;background-color:#000;opacity:.1;} .viseditcontents{position:absolute;top:1%;bottom:1%;left:1%;right:1%;padding-bottom:50px;border:1px solid #9e9e9e;border-radius:3px;box-shadow: 0 3px 7px;} .viseditcontents iframe {width:100%;height:100%;border:0;} .viseditclosebut{position:absolute;right:5px;top:5px;font-size:20px;font-weight:bold;color:#858585;cursor:pointer;height:22px;width:22px;background-color:transparent;font-family:serif;border:0;} .viseditcancelbut{position:absolute;bottom:10px;right:28px;cursor:pointer;font-size:18px;} .viseditokbut{position:absolute;bottom:10px;right:150px;cursor:pointer;font-size:18px;}</style>").appendTo('head');
}

$('body').on('click', '.viseditbut', function(){
  var $elem = $(this).prev();
  var val = $elem.is(':input') ? $elem.val() : $elem.html();

  var my_path = editor_path;
  var p = [];
  if ($elem.attr('data-startPath')) {
    p.push('startPath=' + escape($elem.attr('data-startPath')));
  }
  if ($elem.attr('data-basePath')) {
    p.push('basePath=' + escape($elem.attr('data-basePath')));
  }
  if (p.length > 0) {
    my_path += '#' + p.join('&');
  }

  var $container = $("<div class=viseditcontainer><div class=viseditblocker /><div class=viseditcontents><iframe src='" + my_path + "'></iframe><button class=viseditclosebut type=button>×</button><button class=viseditokbut type=button>Ok</button><button class=viseditcancelbut type=button>Cancel</button></div></div>");
  $container.data('visedit-elem', $elem);

  $container.find('iframe').load(function(){
    var w = this.contentWindow;
    setTimeout(function(){ w.tinymce.activeEditor.setContent(val); }, 100);
  });

  $container.appendTo('body');
  return true;
});

$('body').on('click', '.viseditclosebut,.viseditcancelbut', function(){
  $(this).closest('.viseditcontainer').remove();
});
$('body').on('click', '.viseditokbut', function(){
  var $container = $(this).closest('.viseditcontainer');
  var $elem = $container.data('visedit-elem'); 
  var $iframe = $container.find('iframe');
  var val = $iframe[0].contentWindow.tinymce.activeEditor.getContent();
  if ($elem.is(':input')) {
    if ($elem.val() != val) $elem.val(val).change();
  } else {
    $elem.html(val);
  }
  $container.remove();
});


});
