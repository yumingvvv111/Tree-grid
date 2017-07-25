define("common/main", ["bui/menu", "bui/tab"], function(l) {
	var k = BUI.app("PageUtil"),
		h = l("bui/menu"),
		m = l("bui/tab");
	var q = "dl-selected",
		c = "ks-hidden",
		z = "dl-last",
		y = "dl-hover",
		o = "nav-item",
		t = "dl-second-slib",
		f = "dl-tab-item",
		u = "dl-collapse",
		w = "dl-hide-current",
		v = "data-index",
		j = 145;

	function g(A) {
		window.topManager = A
	}
	function b(A, B) {
		if (A.indexOf("?") !== -1) {
			return A + "&" + B
		} else {
			return A + "?" + B
		}
	}
	function i(C, F, I, G, B) {
		var J = this,
			D = new h.SideMenu(I),
			E = new m.NavTab(F),
			K = $(I.render),
			A = K.next("." + t + "-con"),
			H = K.parents("." + f);
		if (A) {
			A.on("click", function() {
				H.toggleClass(u)
			});
			A.parent().height(F.height)
		}
		if (G) {
			H.addClass(u)
		}
		D.on("menuclick", function(M) {
			var L = M.item;
			if (L) {
				J.tab.addTab({
					id: L.get("id"),
					title: L.get("text"),
					href: L.get("href"),
					closeable: L.get("closeable")
				}, true)
			}
		});
		D.on("itemselected", function(M) {
			var L = M.item;
			if (L) {
				e(C, L.get("id"))
			}
		});
		E.on("activeChange", function(M) {
			var L = M.item;
			if (L) {
				J.menu.setSelectedByField(L.get("id"))
			} else {
				J.menu.clearSelection()
			}
		});
		J.tab = E;
		J.menu = D;
		J.homePage = B;
		E.render();
		D.render()
	}
	function e(B, A) {
		A = A || "";
		var C = "#" + B;
		if (A) {
			C += "/" + A
		}
		location.hash = C
	}
	function d() {
		var E = location.hash,
			D = 0,
			A = "",
			B = E.indexOf("/"),
			C = null;
		if (!E) {
			return null
		}
		if (B >= 0) {
			D = E.substring(1, B);
			A = E.substring(B + 1);
			C = s(A);
			if (C) {
				A = A.replace("?" + C, "")
			}
		} else {
			D = E.substring(1)
		}
		return {
			moduleId: D,
			pageId: A,
			search: C
		}
	}
	function s(A) {
		var B = A.indexOf("?");
		if (B >= 0) {
			return A.substring(B + 1)
		}
		return null
	}
	function n(A) {
		if (!$.isArray(A)) {
			return
		}
		var B = r(A);
		while (B !== -1) {
			A.splice(B, 1);
			B = r(A)
		}
		return A
	}
	function r(B) {
		var A = -1;
		$.each(B, function(C, D) {
			if (D === null || D === undefined) {
				A = C;
				return false
			}
		});
		return A
	}
	function a() {
		var A = BUI.viewportHeight(),
			B = 70;
		return A - B
	}
	function p(A) {
		var B = $(A);
		if (B.hasClass(o)) {
			return A
		}
		return B.parent("." + o)[0]
	}
	var x = function(A) {
			n(A);
			x.superclass.constructor.call(this, A);
			this._init();
			g(this)
		};
	x.ATTRS = {
		currentModelIndex: {},
		hideItmes: {
			value: []
		},
		hideList: {},
		modules: {
			value: []
		},
		modulesConfig: {},
		navList: {
			valueFn: function() {
				return $("#J_Nav")
			}
		},
		navContent: {
			valueFn: function() {
				return $("#J_NavContent")
			}
		},
		navItems: {
			valueFn: function() {
				return $("#J_Nav").children("." + o)
			}
		},
		navTabs: {
			valueFn: function() {
				return this.get("navContent").children("." + f)
			}
		},
		urlSuffix: {
			value: ".html"
		}
	};
	BUI.extend(x, BUI.Base);
	BUI.augment(x, {
		openPage: function(P) {
			var K = this,
				F = P.moduleId || K._getCurrentModuleId(),
				D = P.id,
				M = P.title || "\u65b0\u7684\u6807\u7b7e\u9875",
				C = P.href,
				O = P.isClose,
				E = P.closeable,
				B = P.reload,
				Q = P.search;
			var H = K._getModule(F);
			if (H) {
				var I = H.tab,
					G = H.menu,
					A = G.getItem(D),
					L = I.getActivedItem(),
					N = L ? L.get("id") : null,
					J = K._getModuleIndex(F);
				if (F != K._getCurrentModuleId()) {
					K._setModuleSelected(J)
				}
				if (A) {
					K._setPageSelected(J, D, B, Q)
				} else {
					I.addTab({
						id: D,
						title: M,
						href: C,
						sourceId: N,
						closeable: E
					}, B)
				}
				if (O) {
					L.close()
				}
			}
		},
		closePage: function(B, A) {
			this.operatePage(A, B, "close")
		},
		reloadPage: function(B, A) {
			this.operatePage(A, B, "reload")
		},
		setPageTitle: function(B, C, A) {
			this.operatePage(A, C, "setTitle", [B])
		},
		operatePage: function(F, H, G, B) {
			F = F || this._getCurrentModuleId();
			B = B || [];
			var A = this,
				C = A._getModule(F);
			if (C) {
				var D = C.tab,
					E = H ? D.getItemById(H) : D.getActivedItem();
				if (E && E[G]) {
					E[G].apply(E, B)
				}
			}
		},
		_createModule: function(F) {
			var A = this,
				D = A._getModuleConfig(F),
				C = A.get("modules");
			if (!D) {
				return null
			}
			var F = D.id,
				B = "#J_" + F + "Tab",
				E = "#J_" + F + "Tree";
			module = new i(F, {
				render: B,
				height: a() - 5
			}, {
				render: E,
				items: D.menu,
				height: a() - 5
			}, D.collapsed, D.homePage);
			C[F] = module;
			return module
		},
		_hideHideList: function() {
			this.get("hideList").hide()
		},
		_init: function() {
			var A = this;
			A._initDom();
			A._initNavItems();
			A._initEvent()
		},
		_initNavItems: function() {
			var J = this,
				D = J.get("navItems"),
				C = J.get("hideItmes");
			if (D.length === 0) {
				return
			}
			$('<div class="nav-item-mask"></div>').appendTo($(D));
			var H = D.length,
				L = BUI.viewportWidth(),
				I = j,
				G = I * H,
				A = 0;
			if (G <= L) {
				return
			}
			$.each(D, function(M, N) {
				$(N).attr(v, M);
				$(N).removeClass(z)
			});
			A = parseInt(L / I);
			var B = D[A - 1];
			J._setLastItem(B);
			C.push($(B).clone()[0]);
			for (var F = A; F < H; F++) {
				var K = $(D[F]),
					E = null;
				E = K.clone()[0];
				C.push(E);
				K.addClass(c)
			}
			J._initHideList()
		},
		_initHideList: function() {
			var C = this,
				B = C.get("hideList"),
				A = C.get("hideItmes");
			if (B) {
				return
			}
			var E = '<ul class="dl-hide-list ks-hidden"></ul>',
				D = $(E).appendTo("body");
			B = D;
			$.each(A, function(F, G) {
				$(G).appendTo(B)
			});
			C.set("hideList", B);
			C._initHideListEvent()
		},
		_initHideListEvent: function() {
			var B = this,
				A = B.get("hideList");
			if (A == null) {
				return
			}
			A.on("mouseleave", function() {
				B._hideHideList()
			});
			A.on("click", function(F) {
				var E = p(F.target),
					D = null,
					C = 0;
				if (E) {
					D = $(E);
					C = D.attr(v);
					B._setModuleSelected(C);
					B._hideHideList()
				}
			})
		},
		_initContents: function() {
			var A = this,
				C = A.get("modulesConfig"),
				B = A.get("navContent");
			B.children().remove();
			$.each(C, function(E, F) {
				var G = F.id,
					D = ['<li class="dl-tab-item ks-hidden"><div class="dl-second-nav"><div class="dl-second-tree" id="J_', G, 'Tree"></div><div class="', t, '-con"><div class="', t, '"></div></div></div><div class="dl-inner-tab" id="J_', G, 'Tab"></div></li>'].join("");
				new $(D).appendTo(B)
			})
		},
		_initDom: function() {
			var A = this;
			A._initContents();
			A._initLocation()
		},
		_initEvent: function() {
			var A = this,
				B = A.get("navItems");
			B.each(function(C, D) {
				var D = $(D);
				D.on("click", function() {
					var E = $(this);
					if (E.hasClass(q)) {
						return
					}
					A._setModuleSelected(C, E)
				}).on("mouseenter", function() {
					$(this).addClass(y)
				}).on("mouseleave", function() {
					$(this).removeClass(y)
				})
			});
			A._initNavListEvent()
		},
		_initNavListEvent: function() {
			var B = this,
				A = B.get("hideList"),
				C = B.get("navList");
			C.on("mouseover", function(F) {
				var E = p(F.target),
					D = $(E),
					G = null;
				if (D && D.hasClass(z) && A) {
					G = D.offset();
					G.top += 37;
					G.left += 2;
					B._showHideList(G)
				}
			}).on("mouseout", function(E) {
				var D = E.toElement;
				if (D && A && !$.contains(A[0], D) && D !== A[0]) {
					B._hideHideList()
				}
			})
		},
		_initLocation: function() {
			var A = this,
				E = d();
			if (E) {
				var C = E.pageId,
					F = E.search,
					D = A._getModuleIndex(E.moduleId);
				A._setModuleSelected(D);
				A._setPageSelected(D, C, true, F)
			} else {
				var B = A.get("currentModelIndex"),
					G = A._getModuleId(B);
				if (B == null) {
					A._setModuleSelected(0)
				} else {
					e(G)
				}
			}
		},
		_getModule: function(C) {
			var A = this,
				B = A.get("modules")[C];
			if (!B) {
				B = A._createModule(C)
			}
			return B
		},
		_getModuleIndex: function(C) {
			var B = this,
				A = 0;
			$.each(B.get("modulesConfig"), function(E, D) {
				if (D.id === C) {
					A = E;
					return false
				}
			});
			return A
		},
		_getModuleConfig: function(C) {
			var B = this,
				A = null;
			$.each(B.get("modulesConfig"), function(E, D) {
				if (D.id === C) {
					A = D;
					return false
				}
			});
			return A
		},
		_getModuleId: function(A) {
			var B = this.get("modulesConfig");
			if (B[A]) {
				return B[A].id
			} else {
				return A
			}
		},
		_getCurrentPageId: function() {
			var A = this,
				E = A._getCurrentModuleId(),
				C = A._getModule(E),
				B = "";
			if (C) {
				var D = C.menu.getSelected();
				if (D) {
					B = D.get("id")
				}
			}
			return B
		},
		_getCurrentModuleId: function() {
			return this._getModuleId(this.get("currentModelIndex"))
		},
		_isModuleInitial: function(A) {
			return !!this.get("modules")[A]
		},
		_setLastItem: function(E) {
			var A = this,
				B = A.get("lastShowItem");
			if (B === E) {
				return
			}
			var C = null,
				D = $(B);
			itemEl = $(E);
			if (B) {
				C = D.find("." + w);
				D.removeClass(z);
				D.addClass(c)
			}
			itemEl.addClass(z);
			itemEl.removeClass(c);
			if (!C) {
				C = $('<span class="icon icon-white  icon-caret-down ' + w + '">&nbsp;&nbsp;</span>')
			}
			C.appendTo(itemEl.children(".nav-item-inner"));
			A.set("lastShowItem", E)
		},
		_setModuleSelected: function(G, F) {
			var I = this,
				E = I.get("navItems"),
				C = I.get("navTabs"),
				H = I.get("currentModelIndex");
			if (H !== G) {
				var A = I._getModuleId(G),
					B = null,
					D = I.get("lastShowItem"),
					J = true;
				if (!I._isModuleInitial(A)) {
					J = false
				}
				B = I._getModule(A);
				F = F || $(I.get("navItems")[G]);
				if (F.hasClass(c) && D) {
					I._setLastItem(F[0]);
					I._setSelectHideItem(G)
				}
				E.removeClass(q);
				F.addClass(q);
				C.addClass(c);
				$(C[G]).removeClass(c);
				H = G;
				I.set("currentModelIndex", H);
				curPageId = I._getCurrentPageId();
				e(A, curPageId);
				if (!curPageId && B.homePage) {
					I._setPageSelected(G, B.homePage)
				}
			}
		},
		_setPageSelected: function(F, G, H, L) {
			var I = this,
				C = I._getModuleId(F) || F,
				D = I._getModule(C);
			if (D && G) {
				D.menu.setSelectedByField(G);
				var K = D.menu.getSelected(),
					E = D.tab,
					B = "",
					A = -1;
				if (K && K.get("id") === G) {
					B = K.get("href");
					B = L ? (b(B, L)) : B;
					D.tab.addTab({
						id: K.get("id"),
						title: K.get("text"),
						closeable: K.get("closeable"),
						href: B
					}, !! H)
				} else {
					if (G) {
						var J = G.replace("-", "/");
						if (J.indexOf("/") === -1) {
							J = C + "/" + J
						}
						if ((A = G.indexOf(".")) === -1) {
							J += I.get("urlSuffix")
						}
						B = L ? (J + "?" + L) : J;
						E.addTab({
							id: G,
							title: "",
							href: B
						}, !! H)
					}
				}
			}
		},
		_showHideList: function(C) {
			var B = this,
				A = B.get("hideList");
			A.css("left", C.left);
			A.css("top", C.top);
			A.show()
		},
		_setSelectHideItem: function(E) {
			var C = this,
				B = C.get("hideList"),
				A = C.get("hideItmes"),
				F = null,
				D = null,
				H = null,
				G = null;
			BUI.each(A, function(J) {
				var I = $(J);
				if (I.attr(v) == E) {
					D = J
				}
				if (I.hasClass(z)) {
					F = J
				}
			});
			if (F !== D) {
				if (F) {
					G = $(F).find(".dl-hide-current");
					$(F).removeClass(z)
				}
				$(D).addClass(z);
				if (!G) {
					G = new Node('<span class="dl-hide-current">&nbsp;&nbsp;</span>')
				}
				H = $(D);
				G.appendTo(H.children(".nav-item-inner"));
				H.prependTo(B)
			}
		}
	});
	k.MainPage = x;
	return x
});