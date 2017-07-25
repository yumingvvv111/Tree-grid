// 注册BUI，用于多tab页面显示
BUI.use('bui/tab', function(Tab) {

  var array = jQuery("#firstPage").val().split("#");
	
  var tab = new Tab.NavTab({
    render: '#tab',
    height: window.screen.availHeight - 200,
    children: [{
      title: array[0],
      href: array[1],
      actived: true,
      id: array[0],
      closeable: false
    }]
  });

  tab.render();

  // 添加新页面事件
  $('#btnAdd').on('click', function() {
    var array = $(this).val().split("#");

    var config = {
      title: array[0],
      href: array[1],
      id: array[0]
    };
    tab.addTab(config);

    if ("ActiveXObject" in window) {

      $("#pageContent").removeAttr("style")
      $("#pageContent").css("min-height", "840px");
    }

  });

  $('#btnRefresh').on('click', function() {
    var item = tab.getActivedItem();
    item && item.reload();
  });

});

// 生成tab页面事件
function tabClick(url) {
  $('#btnAdd').val(url);
  $('#btnAdd').click();
}

// 页面加载完毕，触发事件，生成首页
window.onload = function() {
  $("#addIndex").click();

  if ("ActiveXObject" in window) {
    $("#pageContent").removeAttr("style")
    $("#pageContent").css("min-height", "840px");
  }
}

// 判断是否为IE浏览器设置相关属性
if ("ActiveXObject" in window) {
  $("#pageContainer").css("margin-top", "17px");
  $("#sidebarToggler").css("margin-top", "25px");
}