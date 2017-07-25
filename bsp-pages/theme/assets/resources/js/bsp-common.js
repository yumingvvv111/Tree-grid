!
function($) {
    "use strict";
    var bspPaginator = function(element, options) {
        this.init(element, options)
    },
    old = null;
    bspPaginator.prototype = {
        init: function(element, options) {
            this.$element = $(element);
            var version = options && options.bootstrapMajorVersion ? options.bootstrapMajorVersion: $.fn.bspPaginator.defaults.bootstrapMajorVersion,
            id = this.$element.attr("id");
            if (2 === version && !this.$element.is("div")) throw "in Bootstrap version 2 the pagination must be a div element. Or if you are using Bootstrap pagination 3. Please specify it in bootstrapMajorVersion in the option";
            if (version > 2 && !this.$element.is("ul")) throw "in Bootstrap version 3 the pagination root item must be an ul element.";
            this.currentPage = 1,
            this.lastPage = 1,
            this.setOptions(options),
            this.initialized = !0
        },
        setOptions: function(options) {
            this.options = $.extend({},
            this.options || $.fn.bspPaginator.defaults, options),
            this.totalPages = parseInt(this.options.totalPages, 10),
            this.numberOfPages = parseInt(this.options.numberOfPages, 10),
            options && "undefined" != typeof options.currentPage && this.setCurrentPage(options.currentPage),
            this.listen(),
            this.render(),
            this.initialized || this.lastPage === this.currentPage || this.$element.trigger("page-changed", [this.lastPage, this.currentPage])
        },
        listen: function() {
            this.$element.off("page-clicked"),
            this.$element.off("page-changed"),
            "function" == typeof this.options.onPageClicked && this.$element.bind("page-clicked", this.options.onPageClicked),
            "function" == typeof this.options.onPageChanged && this.$element.on("page-changed", this.options.onPageChanged),
            this.$element.bind("page-clicked", this.onPageClicked)
        },
        destroy: function() {
            this.$element.off("page-clicked"),
            this.$element.off("page-changed"),
            this.$element.removeData("bspPaginator"),
            this.$element.empty()
        },
        show: function(page) {
            this.setCurrentPage(page),
            this.render(),
            this.lastPage !== this.currentPage && this.$element.trigger("page-changed", [this.lastPage, this.currentPage])
        },
        showNext: function() {
            var pages = this.getPages();
            pages.next && this.show(pages.next)
        },
        showPrevious: function() {
            var pages = this.getPages();
            pages.prev && this.show(pages.prev)
        },
        showFirst: function() {
            var pages = this.getPages();
            pages.first && this.show(pages.first)
        },
        showLast: function() {
            var pages = this.getPages();
            var total = Number($('input[name=totalCount]').val());
            isNaN(total) && (total = 1);
            var last = Math.ceil(total/10);
            this.show(last);
        },
        onPageItemClicked: function(event) {
            var type = event.data.type,
            page = event.data.page;
            this.$element.trigger("page-clicked", [event, type, page])
        },
        onPageClicked: function(event, originalEvent, type, page) {
            var currentTarget = $(event.currentTarget);
            switch (type) {
            case "first":
                currentTarget.bspPaginator("showFirst");
                break;
            case "prev":
                currentTarget.bspPaginator("showPrevious");
                break;
            case "next":
                currentTarget.bspPaginator("showNext");
                break;
            case "last":
                currentTarget.bspPaginator("showLast");
                break;
            case "page":
                currentTarget.bspPaginator("show", page)
            }
        },
        render: function() {
            var containerClass = this.getValueFromOption(this.options.containerClass, this.$element),
            size = this.options.size || "normal",
            alignment = this.options.alignment || "left",
            pages = this.getPages(),
            listContainer = 2 === this.options.bootstrapMajorVersion ? $("<ul class='pagination'></ul>") : this.$element,
            listContainerClass = 2 === this.options.bootstrapMajorVersion ? this.getValueFromOption(this.options.listContainerClass, listContainer) : null,
            first = null,
            prev = null,
            next = null,
            last = null,
            p = null,
            i = 0;
            switch (this.$element.prop("class", ""), this.$element.addClass("pagination"), size.toLowerCase()) {
            case "large":
            case "small":
            case "mini":
                this.$element.addClass($.fn.bspPaginator.sizeArray[this.options.bootstrapMajorVersion][size.toLowerCase()])
            }
            if (2 === this.options.bootstrapMajorVersion) switch (alignment.toLowerCase()) {
            case "center":
                this.$element.addClass("pagination-centered");
                break;
            case "right":
                this.$element.addClass("pagination-right")
            }
            for (this.$element.addClass(containerClass), this.$element.empty(), 2 === this.options.bootstrapMajorVersion && (this.$element.append(listContainer), listContainer.addClass(listContainerClass)), this.pageRef = [], pages.first && (first = this.buildPageItem("first", pages.first), first && listContainer.append(first)), pages.prev && (prev = this.buildPageItem("prev", pages.prev), prev && listContainer.append(prev)), i = 0; i < pages.length; i += 1) p = this.buildPageItem("page", pages[i]),
            p && listContainer.append(p);
            pages.next && (next = this.buildPageItem("next", pages.next), next && listContainer.append(next)),
            pages.last && (last = this.buildPageItem("last", pages.last), last && listContainer.append(last))
        },
        buildPageItem: function(type, page) {
            var itemContainer = $("<li></li>"),
            itemContent = $("<a></a>"),
            text = "",
            title = "",
            itemContainerClass = this.options.itemContainerClass(type, page, this.currentPage),
            itemContentClass = this.getValueFromOption(this.options.itemContentClass, type, page, this.currentPage),
            tooltipOpts = null;
            switch (type) {
            case "first":
                if (!this.getValueFromOption(this.options.shouldShowPage, type, page, this.currentPage)) return;
                text = this.options.itemTexts(type, page, this.currentPage);
                break;
            case "last":
                if (!this.getValueFromOption(this.options.shouldShowPage, type, page, this.currentPage)) return;
                text = this.options.itemTexts(type, page, this.currentPage);
                break;
            case "prev":
                if (!this.getValueFromOption(this.options.shouldShowPage, type, page, this.currentPage)) return;
                text = this.options.itemTexts(type, page, this.currentPage);
                break;
            case "next":
                if (!this.getValueFromOption(this.options.shouldShowPage, type, page, this.currentPage)) return;
                text = this.options.itemTexts(type, page, this.currentPage);
                break;
            case "page":
                if (!this.getValueFromOption(this.options.shouldShowPage, type, page, this.currentPage)) return;
                text = this.options.itemTexts(type, page, this.currentPage);
            }
            return itemContainer.addClass(itemContainerClass).append(itemContent),
            itemContent.addClass(itemContentClass).html(text).on("click", null, {
                type: type,
                page: page
            },
            $.proxy(this.onPageItemClicked, this)),
            this.options.pageUrl && itemContent.attr("href", this.getValueFromOption(this.options.pageUrl, type, page, this.currentPage)),
            this.options.useBootstrapTooltip ? (tooltipOpts = $.extend({},
            this.options.bootstrapTooltipOptions, {
            }), itemContent.tooltip(tooltipOpts)) : itemContent.attr("href", 'javascript:void(0)'),
            itemContainer
        },
        setCurrentPage: function(page) {
            if (page > this.totalPages || 1 > page) {
            	console.log("Page out of range");
            }
            this.lastPage = this.currentPage,
            this.currentPage = parseInt(page, 10)
        },
        getPages: function() {
            var totalPages = this.totalPages,
            pageStart = 0 === this.currentPage % this.numberOfPages ? (parseInt(this.currentPage / this.numberOfPages, 10) - 1) * this.numberOfPages + 1 : parseInt(this.currentPage / this.numberOfPages, 10) * this.numberOfPages + 1,
            output = [],
            i = 0,
            counter = 0;
            for (pageStart = 1 > pageStart ? 1 : pageStart, i = pageStart, counter = 0; counter < this.numberOfPages && totalPages >= i; i += 1, counter += 1) output.push(i);
            return output.first = 1,
            output.prev = this.currentPage > 1 ? this.currentPage - 1 : 1,
            output.next = this.currentPage < totalPages ? this.currentPage + 1 : totalPages,
            output.last = totalPages,
            output.current = this.currentPage,
            output.total = totalPages,
            output.numberOfPages = this.options.numberOfPages,
            output
        },
        getValueFromOption: function(value) {
            var output = null,
            args = Array.prototype.slice.call(arguments, 1);
            return output = "function" == typeof value ? value.apply(this, args) : value
        }
    },
    old = $.fn.bspPaginator,
    $.fn.bspPaginator = function(option) {
        var args = arguments,
        result = null;
        return $(this).each(function(index, item) {
            var $this = $(item),
            data = $this.data("bspPaginator"),
            options = "object" != typeof option ? null: option;
            if (!data) return data = new bspPaginator(this, options),
            $this = $(data.$element),
            $this.data("bspPaginator", data),
            void 0;
            if ("string" == typeof option) {
                if (!data[option]) throw "Method " + option + " does not exist";
                result = data[option].apply(data, Array.prototype.slice.call(args, 1))
            } else result = data.setOptions(option)
        }),
        result
    },
    $.fn.bspPaginator.sizeArray = {
        2 : {
            large: "pagination-large",
            small: "pagination-small",
            mini: "pagination-mini"
        },
        3 : {
            large: "pagination-lg",
            small: "pagination-sm",
            mini: ""
        }
    },
    $.fn.bspPaginator.defaults = {
        containerClass: "",
        size: "normal",
        alignment: "left",
        bootstrapMajorVersion: 2,
        listContainerClass: "",
        itemContainerClass: function(type, page, current) {
            return page === current ? "active": ""
        },
        itemContentClass: function(type, page, current) {
            return ""
        },
        currentPage: 1,
        numberOfPages: 5,
        totalPages: 1,
        pageUrl: function(type, page, current) {
            return null
        },
        onPageClicked: null,
        onPageChanged: null,
        useBootstrapTooltip: !1,
        shouldShowPage: function(type, page, current) {
            var result = !0;
            switch (type) {
            case "first":
                result = 1 !== current;
                break;
            case "prev":
                result = 1 !== current;
                break;
            case "next":
                result = current !== this.totalPages;
                break;
            case "last":
                result = current !== this.totalPages;
                break;
            case "page":
                result = !0
            }
            return result
        },
        itemTexts: function(type, page, current) {
            switch (type) {
            case "first":
                return "首页";
            case "prev":
                return "&lt;";
            case "next":
                return "&gt;";
            case "last":
                return "尾页";
            case "page":
                return page
            }
        },
        bootstrapTooltipOptions: {
            animation: !0,
            html: !0,
            placement: "top",
            selector: !1,
            title: "",
            container: !1
        }
    },
    $.fn.bspPaginator.Constructor = bspPaginator
} (window.jQuery);

/**=========
 * 树形表格公共组件
 * @className: TreeList
 * @param dataURL{string}: 请求地址
 * @param listType{string}: 列表类型，默认是树列表
 * @param childNodeName{string}: 如果是树形列表，指定子节点的字段名称
 * @param convertRecord{function} 如果数据有问题可以自定义转换函数
 * @usage:
 * 一 使用步骤：
 *   1)    在对应的页面上添加#parse("/inc/kendoUI.html")
 *   2) 添加列表将要放置的容器
 *     e.g.
 *     <div id="treeList"><div class="tree-list-content"> </div></div>
 *     <div id="paginationWrapper" class="text-right"></div>
 *   3) 在js里创建list对象
 *     e.g.
 *     var treeList = new TreeList({
    	    dataURL: '/bsp/sysMenu/find',
    	    //listType:'simple',//可选项，默认渲染为树形列表，simple时为普通列表
    	    //convertRecord: function(dataRecord, exportObj, beginIndex){ },//可选项，转换函数
    	    fieldMap: {
    			id: {
    				value: 'pkId',
    				type: 'number'
    			},
    			parentID: {
    				value: 'parentId',
    				type: 'number',
    				condition: 'parentId !== 0'
    			},
    			//...
    			createDate: {
    				value: 'createDate',
    				type: 'string',
    				title:'创建时间'
    			},
    			sort: {
    				value: 'sort',
    				type: 'string',
    				title: '排序'
    			},
    			action: {
    				value: '<a class="hidden" onclick="toFunctionList({#pkId})" href="javascript:void(0)"> 添加子菜单功能点 </a>\
		             <a onclick="openDetailedFunction({#pkId})" href="javascript:void(0)"> 详细</a>\
		             <a onclick="updateChildFunction({#pkId})" href="javascript:void(0)"> 修改 </a>\
		             <a href="javascript:void(0)" onclick="deleteId({#pkId});" id="modify{#pkId}">禁用</a>',
    				type: 'html',
    				title: '操作'
    			}
    	}
  });
 * 二 问题：
 *   1) 如何切换普通列表和树形列表?
 *      new的时候配置listType属性，如果值为tree则为树形列表，反之为普通列表
 *      e.g.
 *      var treeList = new TreeList({
    	    dataURL: '/bsp/sysMenu/find',
    	    listType:'tree',
    	    ...});
 树形列表示例地址：用户中心-菜单管理，对应文件路径/com.bioeh.sp.hm.bsp/src/main/webapp/WEB-INF/views/usercenter/menu/menu_list.html
 普通列表示例地址： 用户中心-权限管理，对应文件路径/com.bioeh.sp.hm.bsp/src/main/webapp/viewjs/usercenter/permission/permission_list.js

 *   2) 一级和二级的操作按钮如何不同?
 *      在字段的value属性写js表达式 true ? 'true的时候显示的按钮' : 'false的时候显示的按钮';
 *      e.g.
 *      action: {
				value: 'tagFId === 0 ?\
					\'<a onclick="openAddTag({#tagId},\\\'\\\')" href="javascript:void(0)"> 添加子标签  </a><a onclick="openAddTag({#tagFId},{#tagId})" href="javascript:void(0)">修改</a>\':\
					\'<a href="javascript:void(0)" onclick="openAddTag({#tagFId},{#tagId})">修改</a>\'\
					',
				type: 'html',
				title: '操作'
			}
 *      示例地址： 标签管理，对应文件路径/com.bioeh.sp.hm.bsp/src/main/webapp/viewjs/member/tag/tagList.js
 *
 *   3) 有的字段是满足条件才有，怎么在字段里配置？
 *      在字段里配置condition属性，值是一个表达式，当表达式返回值是true时才有此字段，e.g.
 *      parentID: {
    				value: 'parentId',
    				type: 'number',
    				condition: 'parentId !== 0'//notice this
    			}
 *   4) 如何在模板里写if esle？
 *   两种写法:
 *   写法1 -> 在value里拼字符串，写成三元表达式(实例地址：标签类别-标签，js地址：/com.bioeh.sp.hm.bsp/src/main/webapp/viewjs/member/tag/tagList.js)
 *   比如：value: 'tagFId === 0 ?\
 \'<a onclick="openAddTag({#tagId},\\\'\\\')" href="javascript:void(0)"> 添加子标签  </a><a onclick="openAddTag({#tagFId},{#tagId})" href="javascript:void(0)">修改</a>\':\
 \'<a href="javascript:void(0)" onclick="openAddTag({#tagFId},{#tagId})">修改</a>\'\
 ',

 写法2 -> 需要配置两个字段value和cellRender，value如果是数组表示罗列所有不同的模板，然后模板的渲染逻辑由cellRender控制，所以上边的例子如果按照这种方式可以写成：

 action: {
				value: [
				 '1::<a onclick="openAddTag({#tagId},\'\')" href="javascript:void(0)"> 添加子标签  </a><a onclick="openAddTag({#tagFId},{#tagId})" href="javascript:void(0)">修改</a>',
	             '2::<a href="javascript:void(0)" onclick="openAddTag({#tagFId},{#tagId})">修改</a>'
	             ],
				type: 'html',
				title: '操作',
				cellRender: function(templateMap, rowData, value){
				    var d = rowData.$this;
				    var template = '';
					if(d.tagFId === 0){
						template = templateMap['1'];
					}else{
						template = templateMap['2'];
					}
					return template;
				}
			}
 (实例地址：用户中心-菜单管理，js地址：/com.bioeh.sp.hm.bsp/src/main/webapp/viewjs/usercenter/menu/userlist.js)

 *   5) 搜索和过滤？
 *   在new的时候配置formID，值为搜索的外围的表单（form）ID号。
 *   formID: '#userpost'
 *
 *
 *   4) 列的显示和隐藏？
 *
 ==========*/

function TreeList(cfg) {
    var self = this;
    var defaultCfg = {
        pageSize: 10,
        treeListSelector: '#treeList',
        paginationWrapper: '#paginationWrapper',
        listType: 'tree'
    };
    cfg = $.extend(defaultCfg, cfg);
    var formID = cfg.formID && (/#/.test(cfg.formID) ? cfg.formID : (cfg.formID.trim() == '' ? 'form:eq(0)' : '#' + cfg.formID)) || 'form:eq(0)';
    this.init = function () {
        var href = window.location.href;
        var paramStr;
        var match = /\?(.*)$/.exec(href);
        if (match !== null) {
            paramStr = match[1];
        }
        this.updateListModel(paramStr);
        this.renderTreelist();
        this.renderPagination(formID);
        this.afterRender();
    };
    this.dataSource = {
        //batch: true,
        schema: {
            model: {
                id: "id",
                parentId: "parentID",
                fields: getFields(cfg.fieldMap),
                expanded: false
            }
        },
        data: [],
    };
    this.setInputVal = function(rs){
    	$('input[name=totalCount]').val(rs.data.totalCount);
    	$('input[name=pageSize]').val(rs.data.pageSize);
    	$('input[name=pageNo]').val(rs.data.pageNo);
    	$('input[name=rSum]').val(rs.data.rSum);
    };
    this.updateListModel = function (params, num) {
    	var n = num || 0;
    	
        $.ajax({
            url: cfg.dataURL + (params ? '?' + params : ''),
            dataType: 'json',
            type: 'get',
            async: false,
            success: function (rs) {
                debugger;
                if (rs.state === 200) {
                    var exportObj = {
                        resultArr: []
                    }
                    var fn = cfg.convertRecord || convertRecord;
                    fn(rs.data.items, exportObj, rs.data.beginIndex);
                    self.dataSource.data = exportObj.resultArr;
                    self.originalRecord = rs.data.items;
                    self.countPages = rs.data.countPages;
                    self.setInputVal(rs);
                }else{
                	self.dataSource.data = [];
                	if(n < 3){
                  	  self.updateListModel(params, ++n);
                  	}
                }
            },
            error: function(ex){
                debugger;
            	self.dataSource.data = [];
            	if(n < 3){
            	  self.updateListModel(params, ++n);
            	}
            }
        });

        function eachParams(obj) {
            var v;
            for (var name in obj) {
                v = obj[name];
                if (/\${[^{}]+}/.test(v)) {
                    return;
                }
                paramObj[name] = v;
            }
        }
    };

    this.renderTreelist = function () {
        $(cfg.treeListSelector).html('<div class="tree-list-content"></div>');
        $(cfg.treeListSelector).find(".tree-list-content").kendoTreeList({
            dataSource: self.dataSource,
            editable: "popup",
            //pageable: true,
            resizable: true,
            //height: 540,
            columns: getColumns(cfg.fieldMap)
        });
        if (cfg.listType === 'checkbox') {
            $(cfg.treeListSelector).find('tr').each(function (i, e) {
                var $this = $(this);
                var firstChild = $this.find('>:first-child');
                var tagName = firstChild.length !== 0 ? firstChild[0].tagName.toLowerCase() : null;
                var cheboxAll = $('<th><input type="checkbox" class="list-checkbox-all"/></th>');
                var chebox = $('<td style="text-align:center;"><input type="checkbox" class="list-checkbox"/></td>');
                if(cfg.checkboxConfig && i > 0){
                	var attrs = cfg.checkboxConfig.attr;
                	if(typeof attrs === 'object'){ 
                		for(var name in attrs){
                			var v = attrs[name];
                			var m = /{#([^{}]+)}/.exec(v);
                			if(m !== null){
                				chebox.find('input').attr(name, self.originalRecord[i-1][m[1]]);
                			}else{
                				chebox.find('input').attr(name, v);
                			}
                		}
                	}
                }
                cheboxAll.find('.list-checkbox-all').click(function () {
                    $(this)[0].checked ? 
                    		$('.list-checkbox').each(function(i, e){
                    			e.checked = true;
                    		}) :
                    			$('.list-checkbox').each(function(i, e){
                    				e.checked = false;
                    			});
                });
                if (tagName === 'th') {
                    cheboxAll.insertBefore(firstChild);
                }
                if (tagName === 'td') {
                    chebox.insertBefore(firstChild);
                }
            });
            $(cfg.treeListSelector).find('colgroup').each(function(i, e){
            	$(this).prepend($('<col style="width: 60px;"></col>'));
            });
        }
        self.setActionWidth();
    };
    this.setActionWidth = function(){
    	var tdWidthArr = [], innerWidthArr = [];
    	$(cfg.treeListSelector).find('tr>:last-child').each(function(i, e){
    		var innerWidth = 0;
    		tdWidthArr.push($(this).width());
    		$(this).children().each(function(i2, e2){
    			innerWidth += $(this).width();
    		});
    		innerWidthArr.push(innerWidth);
    	});
    	innerWidthArr.sort(function(a, b){
    		return a < b;
    	});
    	tdWidthArr.sort(function(a, b){
    		return a < b;
    	});
    	if(innerWidthArr[0] > tdWidthArr[0]){
    	  $(cfg.treeListSelector).find('col:last-child').css('width', (innerWidthArr[0] + 70) +'px');
    	}
    };
    this.afterRender = function () {
        var searchButton = $(formID).find('button:contains("搜索")');
        searchButton = searchButton.length === 0 ? $(formID).find('[value=搜索]') : searchButton;
        if (searchButton.length !== 0) {
            searchButton[0].onclick = function (e) {
                self.updateListModel($(formID).serialize().replace(/pageNo=(\d*)?/, function (m1, m2) {
                    return 'pageNo=' + 1;
                }));
                self.renderTreelist();
                self.renderPagination(formID);
                e.preventDefault(), e.stopPropagation();
            };
        }
    };
    this.renderPagination = function(){
    	var options = {
    			currentPage : parseInt($("#pageNo").val()),
    			totalPages : Number(self.countPages),
    			size : "normal",
    			alignment : "center",
    			numberOfPages : 10,
    			onPageClicked : function(e, originalEvent, type, page) {
    				if ($(formID).length !== 0) {
    			          self.updateListModel($(formID).serialize().replace(/pageNo=(\d*)?/, function (m1, m2) {
    			            return 'pageNo=' + page;
    			          }));
    			          self.renderTreelist();
    			        }
    			}
    		}
    		$(cfg.paginationWrapper).bspPaginator(options);
    	    $(cfg.paginationWrapper).css('float', 'right');
//    	    $(cfg.paginationWrapper).append($('<span style="display:inline-block;line-height:30px;float:left;margin:20px 10px;">跳转至:&nbsp;&nbsp;<input type="text" style="width:60px;"></span>'));
    };
    this.init();
    function getFields(fieldMap) {
        var obj = {}, _obj;
        for (var name in fieldMap) {
            _obj = {};
            _obj['type'] = fieldMap[name]['type'] === 'html' ? 'string' : fieldMap[name]['type'];
            if (fieldMap[name]['condition']) {
                _obj['nullable'] = true;
            }
            obj[name] = _obj;
        }
        if (cfg.listType !== 'tree') {
            obj['parentID'] = {
                type: 'number',
                nullable: true
            };
        }
        return obj;
    }

    function getColumns(fieldMap) {
        var arr = [], _obj, _item;
        for (var name in fieldMap) {
            _obj = {}, _item = fieldMap[name];
            if (_item.title) {
                _obj['field'] = name;
                _obj['title'] = _item.title;
                _item.width && (_obj['width'] = _item.width);
                _item.expandable && (_obj['expandable'] = _item.expandable);
                if (_item.type === 'html' || _item.type === 'string') {
                    _obj['template'] = (function (name) {
                        return function (d) {
                        	var str = d[name];
                            return str;
                        };
                    })(name);
                }
                if (_item.cellRender) {
                    _obj['template'] = (function (_item, name) {
                        return function (dataRecord) {
                            var obj = {};
                            var value = dataRecord[name];
                            var _arr = value.split(/(\d+)?::/);
                            for (var i = 1, len = _arr.length, e = null, keys = [], vals = []; i < len; i++) {
                                e = _arr[i];
                                if (i % 2 === 0) {
                                	if(typeof e === 'string'){
                                		e = e.replace(/,$/, '');
                                	}
                                    vals.push(e);
                                } else {
                                    keys.push(e);
                                }
                            }
                            for (var n = 0; n < keys.length; n++) {
                                obj[keys[n]] = vals[n];
                            }
                            var resultTamplate = _item.cellRender(obj, dataRecord, value);
                            return replaceHtml(resultTamplate, dataRecord.$this).replace(/,$/, '');
                        }
                    })(_item, name);
                }
                arr.push(_obj);
            }
        }
        return arr;
    }

    function evalFn(str, scope) {
        with (scope) {
            try {
            	var sesult = eval(str);
                return sesult;
            } catch (ex) {
                throw ex;
                return '';
            }
        }
    }

    function replaceHtml(htmlStr, scope) {
        if (htmlStr instanceof Object) {
            return htmlStr;
        }
        if (/^.*?==[^?]*?\?/.test(htmlStr)) {
            htmlStr = evalFn(htmlStr, scope);
        }
        return htmlStr.replace(/(?:\$\!)?{#?([^{}]+)}/g, function (m1, m2) {
            var result;
            result = evalFn(m2, scope);
            return result;
        });
    }
    
    function cutText(text){
    	if (typeof text === 'string' && text.length > 20) {
            if (/<[^<>]*?>/.test(_obj[fieldName])) {
            	text = text.replace(/<([^<>]+)>(.*?)<\/\1>/g, function (m1, m2, m3) {
                    if (m3 > 20) {
                        m3 = m3.slice(0, 20) + '...';
                    }
                    return '<' + m2 + '>' + m3 + '</' + m2 + '>';
                });
            } else {
            	text = text.slice(0, 20) + '...';
            }
        }
    	return text;
    }
    function convertRecord(rs, exportObj, beginIndex, parentRecord, level) {
        var mapItem, p = parentRecord;
        level = level || 0;
        level++;
        function produceBlank(amount){
        	var arr = [];
        	var n = 0;
        	while(amount--){
        		n += 25;
        	}
        	return n;
        }
        if (rs instanceof Array) {
            loop1:for (var n = beginIndex, i = 0, len = rs.length, _item, _obj; i < len; i++, n++) {
                _obj = {};
                _obj['$this'] = _item = rs[i];
                _obj['$parent'] = p;
                _obj['$eval'] = function(str, scope){
                	scope = scope ? $.extend(_item, scope) : _item;
                	with (scope) {
                		return replaceHtml(str, scope);
                    }
                };
                _item.$index = n + 1;
                _item.$level = level;
                loop2:for (var fieldName in cfg.fieldMap) {
                    mapItem = cfg.fieldMap[fieldName];
                    if (mapItem.condition) {
                        if (evalFn(mapItem.condition, _item)) {
                            _obj[fieldName] = mapItem.value === '$index' ? _item.$index : evalFn(mapItem.value, _item);
                            if (mapItem.isSingle) {
                                continue loop2;
                            }
                        }
                    } else {
                        if (mapItem.type === 'html') {
                        	var resultHtml = replaceHtml(mapItem.value, _item);
                            _obj[fieldName] = '<div onmouseover="javascript:$(this).attr(\'title\', $(this).text());" class="bsp-list-ellipsis" style="padding-left:'+ produceBlank(level - 1) +'px;">' + (!resultHtml || resultHtml === 'null' ? '' : resultHtml) + '</div>';
                        } else if(mapItem.type === 'string'){
                        	var resultVal = evalFn(mapItem.value, _item);
                            _obj[fieldName] = mapItem.value === '$index' ? _item.$index : '<div onmouseover="javascript:$(this).attr(\'title\', $(this).text());" class="bsp-list-ellipsis" style="padding-left:'+ produceBlank(level - 1) +'px;">' + (!resultVal || resultVal === 'null' ? '' : resultVal) + '</div>';
                        }else{
                        	var resultVal = evalFn(mapItem.value, _item);
                        	_obj[fieldName] = mapItem.value === '$index' ? _item.$index : (!resultVal || resultVal === 'null' ? '' : resultVal);
                        }
                    }
                }
                cfg.listType === 'tree' && _item[cfg.childNodeName] && _item[cfg.childNodeName].length !== 0 && arguments.callee(_item[cfg.childNodeName], exportObj, beginIndex, _item, level);
                exportObj.resultArr.push(_obj);
                
            }
        }
    }
}
TreeList.toggleExpand = function (type){
	  var treeList = $("#treeList .tree-list-content").data("kendoTreeList");
	  $("#treeList tbody>tr").each(function(i, e){
	    treeList[type]($(e));
	  });
	};