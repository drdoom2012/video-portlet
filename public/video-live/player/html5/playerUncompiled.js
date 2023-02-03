function initializePlayer() {
    function a() {
        k.info("creating Controls");
        var a = this;
        if (z.initializeGlobal(), this.hiddenOverlay = !0, this.insideControls = new x("controls"), this.insideControls.emptyCallback = function() {
                a.showControls()
            }, this.insideControls.nonEmptyCallback = function() {
                a.showControls()
            }, this.hideSettingsOnMouseLeaveTimer = new y(function() {
                m.deactivateScreen("settings")
            }), this.insideSettings = new x("settings"), this.insideSettings.emptyCallback = function() {
                a.hideSettingsOnMouseLeaveTimer.setTimeout(20)
            }, this.insideSettings.nonEmptyCallback = function() {
                a.hideSettingsOnMouseLeaveTimer.cancel(), m.activateSettingsScreen()
            }, this.insidePlayer = new x("player"), j.isPC && (this.insidePlayer.emptyCallback = function() {
                $(j.mainShellId + " #videoShell").addClass("controlsExited")
            }, this.insidePlayer.nonEmptyCallback = function() {
                $(j.mainShellId + " #videoShell").removeClass("controlsExited")
            }), this.seekBarActive = new x("seekbar"), this.seekBarActive.emptyCallback = function() {
                m.deactivateScreen("seek")
            }, this.seekBarActive.nonEmptyCallback = function() {
                m.activateScreen("seek")
            }, this.volumeActive = new x("volume"), this.volumeActive.emptyCallback = function() {
                m.deactivateScreen("volume")
            }, this.volumeActive.nonEmptyCallback = function() {
                m.activateScreen("volume")
            }, this.versionInfoClickCount = 0, this.lastShowControls = new Date, $(j.mainShellId + " .playerMainShell")[0].addEventListener("mousedown", function() {
                var b;
                (b = void 0 == document.activeElement || 0 == $(document.activeElement).closest(j.mainShellId + " .playerMainShell").length) && (k.debug("Refocusing player on mousedown"), a.focusPlayer())
            }, !0), $(j.mainShellId + " #versionInfoOpener").on("click", function() {
                void 0 != l.versionInfoClickTimeout && (window.clearTimeout(l.versionInfoClickTimeout), l.versionInfoClickTimeout = void 0), l.versionInfoClickCount++, k.info("Clickcount", l.versionInfoClickCount), l.versionInfoClickCount >= 8 ? (l.versionInfoClickCount = 0, l.displayVersionInformation()) : l.versionInfoClickTimeout = window.setTimeout(function() {
                    l.versionInfoClickTimeout = void 0, l.versionInfoClickCount = 0
                }, 1e3)
            }), $(j.mainShellId + " #overlay").click(function() {
                if (k.info("click ", l.hiddenOverlay, j.isPC), "playing" == j.playerStatus) {
                    var a = j.currentItem.getClickThroughUrl();
                    if (void 0 != a && !j.isHbbTvActive()) return window.open(a), void j.pause()
                }
                if (!j.isPC) {
                    if (l.hiddenOverlay) return void(j.autoPlayDisplayed ? j.play() : l.showControls());
                    if (void 0 != m.getActiveScreen()) return m.activateScreen(void 0), void l.showControls();
                    l.showControls()
                }
                var b = l.activeCentralButton.attr("id");
                switch (b) {
                    case "playBtn":
                        j.play();
                        break;
                    case "stopBtn":
                        j.stop();
                        break;
                    case "pauseBtn":
                        j.pause();
                        break;
                    case "replayBtn":
                        j.replay();
                        break;
                    default:
                        k.warning("Weird, unknown activeBtn id: ", b)
                }
            }), $(j.mainShellId + " #videoShell").dblclick(function() {
                j.toggleFullScreen()
            }), $(j.mainShellId + " #audioPlayBtn").click(function() {
                var a = $(this).is(":focus");
                $(j.mainShellId + " #audioPlayBtn").css("display", "none"), $(j.mainShellId + " #audioStopBtn").css("display", "inline-block"), a && $(j.mainShellId + " #audioStopBtn").focus(), j.play()
            }), $(j.mainShellId + " #audioStopBtn").click(function() {
                var a = $(this).is(":focus");
                $(j.mainShellId + " #audioPlayBtn").css("display", "inline-block"), $(j.mainShellId + " #audioStopBtn").css("display", "none"), a && $(j.mainShellId + " #audioPlayBtn").focus(), j.pause()
            }), j.isPC && ($(j.mainShellId + " #audioSubtitlesShell").mouseenter(function() {
                m.activateSettingsScreen()
            }), $(j.mainShellId + " #audioSubtitlesShell").mouseleave(function() {
                m.deactivateScreen("settings")
            })), $(j.mainShellId + " #audioSubtitlesShell").click(function() {
                var a = $(this).is(":focus");
                if (m.toggleScreenActive("settings"), a) {
                    $(j.mainShellId + " #settingsSubtitles").find(".settingsSelectorList .listItem")[0].focus()
                }
            }), $(j.mainShellId + " #controls > *").click(function(a) {
                a.stopPropagation()
            }), $(j.mainShellId + " #settingsDiv").click(function(a) {
                m.closeSettingsDropDowns(), a.stopPropagation()
            }), $(j.mainShellId + " .settingsSelector, " + j.mainShellId + " #settingsPairedTvInfo").click(function(a) {
                k.debug("settingsSelector clicked ", a.target), m.openSettingsDropDown(a.target), a.preventDefault(), a.stopPropagation()
            }), $(j.mainShellId + " .settingsNativeSelect").on("click", function(a) {
                a.stopPropagation()
            }), $(j.mainShellId + " .seriesReplayBtn").click(function() {
                clearTimeout(l.nextInSeriesCountDownInterval), j.replay()
            }), $(j.mainShellId + " .dontHideControls").dblclick(function(a) {
                a.stopPropagation()
            }), $(j.mainShellId + " .dontDblClick").dblclick(function(a) {
                k.debug("dontDblClick stopPropagation"), a.stopPropagation()
            }), j.isPC && ($(j.mainShellId + " .dontHideControls").bind("mouseenter", function(a) {
                l.insideControls.enterElement(this)
            }), $(j.mainShellId + " .dontHideControls").bind("mouseleave", function(a) {
                l.insideControls.leaveElement(this)
            })), $(j.mainShellId + " .dontHideControls").bind("focus", function(a) {
                l.insideControls.enterElement(this)
            }), $(j.mainShellId + " .dontHideControls").bind("blur", function(a) {
                l.insideControls.leaveElement(this)
            }), j.isPC && $(j.mainShellId + " #overlay").bind("mousemove", function(a) {
                l.showControls()
            }), window.setInterval(function() {
                if (j.isPC ? !l.insideControls.isInElement() : void 0 == m.getActiveScreen()) {
                    (new Date).getTime() - l.lastShowControls.getTime() >= 1e3 * j.hideControlsDelay && l.hideControls()
                }
            }, 500), j.isPC ? ($(j.mainShellId + " #overlay").bind("mouseenter", function(a) {
                l.insidePlayer.enterElement(this)
            }), $(j.mainShellId + " #overlay").bind("mouseleave", function(a) {
                l.insidePlayer.leaveElement(this)
            })) : ($(j.mainShellId).click(function(a) {
                a.stopPropagation()
            }), document.addEventListener("click", function() {
                l.hiddenOverlay || (k.debug("hiding controls on #overlay mouseleave"), m.activateScreen(void 0), l.hideControls())
            })), j.isPC && $(j.mainShellId + " #hbbTvShell").bind("mouseenter", function(a) {
                j.getAvailTVsInfo().length > 1 && m.activateScreen("hbbTv")
            }), $(j.mainShellId + " #hbbTvShell").bind("mouseleave", function(a) {
                m.deactivateScreen("hbbTv")
            }), $(j.mainShellId + " #hbbTvShell").bind("click", function(a) {
                void 0 == j.selectedTvId ? 1 == j.getAvailTVsInfo().length ? j.activateHbbTv(j.getAvailTVsInfo()[0].id) : m.activateScreen("hbbTv") : j.deactivateHbbTv()
            }), $(j.mainShellId + " #addTvCodeInputShell").on("submit", function(a) {
                a.preventDefault(), j.pairHbbTvDevice($(j.mainShellId + " #addTvCodeInput").val())
            }), $(j.mainShellId + " #addTvCodeInput").keydown(function(a) {
                13 == a.which && (a.preventDefault(), $(this).closest("form").submit()), a.stopPropagation()
            }), $(j.mainShellId + " #addTvCodeSubmit").on("click", function(a) {
                a.stopPropagation(), $(this).closest("form").submit()
            }), $(j.mainShellId + " #addTvCodeInput").on("input", function() {
                l.formatAddTvCodeInput(this)
            }), j.isPC) $(j.mainShellId + " #seekBarArea").mouseenter(function() {
            l.seekBarActive.enterElement(this)
        }), $(j.mainShellId + " #seekBarArea").mouseleave(function() {
            l.seekBarActive.leaveElement(this)
        });
        else {
            var b = $(j.mainShellId + " #seekBarArea"),
                c = "ontouchstart" in document.documentElement;
            b.on(c ? "touchstart" : "mousedown", function(a) {
                m.activateScreen("seek")
            }), b.on(c ? "touchend" : "mouseup", function(a) {
                m.deactivateScreen("seek"), l.showControls()
            })
        }
        new z($(j.mainShellId + " #seekBarTouchArea")[0], {
            startDragging: function(b, c, d) {
                [a.seekBarActive, a.insidePlayer, a.insideControls].forEach(function(a) {
                    a.enterElement(c)
                }), l.showPreviewImage(d.elementX)
            },
            dragging: function(a, b, c) {
                l.showPreviewImage(c.elementX)
            },
            stopDragging: function(b, c, d) {
                var e = $(j.mainShellId + " #seekBar")[0],
                    f = a.computeDraggingPosition(c, "horizontal", parseFloat(e.min), parseFloat(e.max), d.elementX);
                k.debug("draggable seek position", f), j.manualSeek(f), [a.seekBarActive, a.insidePlayer, a.insideControls].forEach(function(a) {
                    a.leaveElement(c)
                }), l.hidePreviewImage()
            }
        }), $(j.mainShellId + " #seekBarTouchArea").click(function(a) {
            a.preventDefault()
        }), $(j.mainShellId + " #seekBarTouchArea").on("contextmenu", function(a) {
            a.preventDefault()
        }), $(j.mainShellId + " #videoShell #seekBarTrackShell").mouseleave(function() {
            $(j.mainShellId + " #seekBarCursor").css("display", "none")
        }), j.isPC && $(j.mainShellId + " #seekBarTouchArea")[0].addEventListener("mousemove", function(a) {
            var b = a.target.getBoundingClientRect();
            l.showPreviewImage(a.clientX - b.left)
        }), $(j.mainShellId + " #overlay").mouseleave(function() {
            l.hidePreviewImage()
        }), $(j.mainShellId + " #videoButtons").mouseleave(function() {
            l.hidePreviewImage()
        }), $(j.mainShellId + " #seekBarTouchArea").mouseleave(function() {
            l.hidePreviewImage()
        }), $(j.mainShellId + " #nextInSeriesBtn").click(function(a) {
            a.preventDefault(), $(j.mainShellId + " #nextInSeriesOverlay").removeClass("active"), clearTimeout(l.nextInSeriesCountDownInterval), $(j.mainShellId + " #skipNextInCountdownSvg").css("animation", ""), j.onPlaylistEnd()
        }), $(j.mainShellId + " #backInTimeShell").click(function() {
            j.switchTimeshift(!0)
        }), $(j.mainShellId + " #liveShell").click(function() {
            j.isTimeshift && j.switchTimeshift(!1, !1)
        }), j.isPC && ($(j.mainShellId + " .dontHideSettings").mouseenter(function() {
            l.insideSettings.enterElement(this)
        }), $(j.mainShellId + " .dontHideSettings").mouseleave(function() {
            l.insideSettings.leaveElement(this)
        })), $(j.mainShellId + " #settingsShell").click(function() {
            m.activateSettingsScreen()
        }), $(j.mainShellId + " #settingsDiv .dontHideSettings").focus(function() {
            l.insideSettings.enterElement(this), l.insidePlayer.enterElement(this)
        }), $(j.mainShellId + " #settingsDiv .dontHideSettings").blur(function() {
            l.insideSettings.leaveElement(this), l.insidePlayer.leaveElement(this)
        }), $(j.mainShellId + " #settingsCloseButton").click(function() {
            void 0 == m.activeSettingsInnerPage ? m.closeSettings() : m.deactivateSettingsInnerPage()
        }), $(j.mainShellId + " .tvSelectorBtn").click(function(a) {
            k.info("TV select " + $(a.target).parent().attr("value"))
        }), $(j.mainShellId + " #addTvBtn, " + j.mainShellId + " #compactAddTvBtn").click(function(a) {
            a.stopPropagation(), m.activateSettingsInnerPage("addTvActive"), $(j.mainShellId + " #addTvCodeInput").val(""), $(j.mainShellId + " #addTvCodeInput").focus()
        }), $(j.mainShellId + " #subtitlesManualSelectorDiv").mouseenter(function() {
            $(j.mainShellId + " #subtitlesManualOptionsDiv").css("display", "inline-block")
        }), $(j.mainShellId + " #subtitlesManualSelectorDiv").mouseleave(function() {
            $(j.mainShellId + " #subtitlesManualOptionsDiv").css("display", "none")
        }), $(j.mainShellId + " #audioTrackManualSelectorDiv").mouseenter(function() {
            $(j.mainShellId + " #audioTrackManualOptionsDiv").css("display", "inline-block")
        }), $(j.mainShellId + " #audioTrackManualSelectorDiv").mouseleave(function() {
            $(j.mainShellId + " #audioTrackManualOptionsDiv").css("display", "none")
        }), $(j.mainShellId + " .qualitySelectorBtn").click(function(a) {
            k.info("Quality select " + $(a.target).parent().attr("value"))
        }), $(j.mainShellId + " #volumeShell").mouseenter(function() {
            l.volumeActive.enterElement(this)
        }), $(j.mainShellId + " #volumeShell").mouseleave(function() {
            l.volumeActive.leaveElement(this)
        }), $(j.mainShellId + " #volumeButtons").focus(function() {
            l.volumeActive.enterElement(this)
        }), $(j.mainShellId + " #volumeButtons").blur(function() {
            l.volumeActive.leaveElement(this)
        }), $(j.mainShellId + " #volumeButtons").click(function() {
            j.switchMute()
        }), new z($(j.mainShellId + " #volumeBar")[0], {
            startDragging: function(a, b, c) {
                this.processHoverKeepers(function(a) {
                    a.enterElement(b)
                }), this.updateVolumeBar(a, b, c, !0)
            },
            dragging: function(a, b, c) {
                this.updateVolumeBar(a, b, c, !0)
            },
            stopDragging: function(a, b, c) {
                this.updateVolumeBar(a, b, c, !1), this.processHoverKeepers(function(a) {
                    a.leaveElement(b)
                })
            },
            processHoverKeepers: function(b) {
                [a.volumeActive, a.insidePlayer, a.insideControls].forEach(b)
            },
            updateVolumeBar: function(a, b, c, d) {
                l.updateVolumeBarWhileDragging(b, c.elementY, d)
            }
        }), $(j.mainShellId + " #newWindowShell").click(function() {
            j.toNewWindow()
        }), $(j.mainShellId + " #fullScreenShell").click(function() {
            j.toggleFullScreen()
        }), this.clickFocusPreventer = function(a) {
            a.preventDefault(), a.stopImmediatePropagation()
        }, this.enterHandler = function(a) {
            13 == (a.which || a.keyCode) && $(a.target).click()
        };
        var d = $(j.mainShellId + " .focusableBtn");
        d.bind("mousedown", this.clickFocusPreventer), d.bind("keypress", this.enterHandler), d.bind("focus", function() {
            l.insidePlayer.enterElement(this)
        }), d.bind("blur", function() {
            l.insidePlayer.leaveElement(this)
        }), $(j.mainShellId + " #seekBarFocusTarget").on("focus", function() {
            l.insidePlayer.enterElement(this)
        }), $(j.mainShellId + " #seekBarFocusTarget").on("blur", function() {
            l.insidePlayer.leaveElement(this)
        }), $(j.mainShellId + " a[href]").bind("mousedown", this.clickFocusPreventer), $(j.mainShellId + " #skipShell").click(function(a) {
            l.skipCountDownOn || j.onSkip(), a.stopPropagation()
        }), $(j.mainShellId + " #versionInfoShell").click(function(a) {
            a.stopPropagation()
        }), $(j.mainShellId + " #hideVersionInfoBtn").click(function(a) {
            l.hideVersionInformation(), a.stopPropagation()
        }), $(j.mainShellId + " .playerMainShell").keydown(function(a) {
            32 == a.keyCode && a.preventDefault(), j.onKeyPress(a)
        }), $(j.mainShellId + " #errorReloadShell").click(function(a) {
            j.replay()
        }), $(j.mainShellId + " #errorHelpShell").click(function(a) {
            k.info("help clicked"), window.open("http://www.ceskatelevize.cz/ivysilani/napoveda/?program-url=" + window.location.pathname + encodeURIComponent(window.location.search), "_blank")
        }), k.info("Controls created")
    }

    function b(a, b, c, d, e) {
        e.preventDefault(), e.stopPropagation(), m.closeSettingsDropDowns(), $(e.target).is(":focus") && $(j.mainShellId + " #settingsShell").focus(), "undefined" == d && (d = void 0), b(d)
    }

    function c() {
        this.activeSceeen = void 0
    }

    function p() {
        this.settings = null, this.version = "62", this.waitingForStream = !1, this.currentItemIndex = 0, this.gemiusPlayerId = "player_" + Math.round(1e6 * Math.random())
    }

    function r() {
        this.ct_playlist = null
    }

    function s(a, b) {
        k.info("creating playlist item: ", a), this.isVast = a, a ? this.vastUrl = b : (this.ctPlaylistItem = b, this.indexes = void 0, void 0 === this.ctPlaylistItem.subtitles && (this.ctPlaylistItem.subtitles = [])), this.subtitleLoaders = []
    }

    function u(a) {
        a || k.error("playerPlayer constructor - video must not be null"), t = a, this.lastSelectedQuality = "auto", k.info("playerPlayer constructor - video-element created")
    }

    function v(a) {
        k.debug("playerShaka constructor - calling parent constructor"), this.parent.constructor(a), this.polyfillsInstalled = !1, this.streamCurrentlyLoading = !1
    }

    function w(a) {
        k.debug("playerHLS constructor - calling parent constructor"), this.parent.constructor(a)
    }

    function x(a) {
        this.name = a, this.inside = [], this.emptyCallback = void 0, this.nonEmptyCallback = void 0
    }

    function y(a) {
        this.target = a, this.timeout = void 0, this.interval = void 0
    }

    function z(a, b) {
        this.element = a, this.consumer = b;
        var c = this;
        this.supportsTouch && (a.addEventListener("touchstart", function(a) {
            c.startDragging(a, "touch")
        }), a.addEventListener("touchmove", function(a) {
            z.prototype.onMove(a, "touch")
        }), a.addEventListener("touchend", function(a) {
            k.debug("touchend"), z.prototype.stopDragging(a, "touch")
        }), a.addEventListener("touchcancel", function(a) {
            k.debug("touchcancel"), z.prototype.stopDragging(a, "touch")
        })), a.addEventListener("mousedown", function(a) {
            c.startDragging(a, "mouse")
        })
    }

    function A() {
        this.pendingFileCount = 0, this.allReadyCallbacks = []
    }

    function B(a) {
        this.levelNames = ["Error", "Warning", "Info", "Debug"], this.checkBindSupported(), this.setLogLevel(a)
    }
    a.prototype.focusPlayer = function() {
        $(j.mainShellId + " .playerMainShell").focus()
    }, a.prototype.setSettingsListItems = function(a, c, d, e, f, g) {
        $(j.mainShellId + " #" + a + " :focus").blur();
        var h = $(j.mainShellId + " #" + a + " .settingsSelectorList");
        h.empty();
        var i = $(j.mainShellId + " #" + a + " .settingsSelectorPlaceholder");
        i.empty();
        var l = $(j.mainShellId + " #" + a + " .settingsSelectorCompactPlaceholderContents");
        l.empty();
        var n = $(j.mainShellId + " #" + a + " .settingsNativeSelect");
        n.empty(), n.off("change.playerSettings"), n.on("change.playerSettings", function(a) {
            $(this).blur(), b(this, e, h, this.value, a)
        });
        var o = this;
        c.forEach(function(c, f) {
            var j = d(c, f),
                m = j.label;
            void 0 == m && (m = j.text);
            var p = g + ": " + m,
                q = {
                    id: a + "-" + f,
                    class: "listItem" + (j.selected ? " selectedListItem" : ""),
                    tabindex: 4,
                    "aria-label": p,
                    title: p,
                    "aria-role": "option"
                },
                r = $("<div/>", q);
            if (r.html(j.text), k.debug("Adding item (" + j.value + ") to " + a), r.appendTo(h), j.selected) {
                q.id = "placeholder-" + q.id, q["aria-role"] = "button";
                var s = $("<div/>", q);
                s.html(j.text), i.append(s), l.append(j.text)
            }
            if (r.on("click", function(a) {
                    b(this, e, h, j.value, a)
                }), n.append("<option value='" + j.value + "'" + (j.selected ? " selected" : "") + ">" + m + "</option>"), void 0 != j.iconHandlers)
                for (var t in j.iconHandlers)
                    if (j.iconHandlers.hasOwnProperty(t)) {
                        k.debug("Adding handler for", j.value, t);
                        var u = r.find("." + t);
                        u.click(j.iconHandlers[t].bind(u, j.value)), o.addDefaultHandlersToSettingsControls(u)
                    }
        }), c.length >= 3 ? h.addClass("manyListItems") : h.removeClass("manyListItems");
        var p = h.parents(".settingsElement");
        c.length < f ? p.addClass("notAvailable") : p.removeClass("notAvailable"), m.addOrRemoveClass(p, c.length > 0, "hasAnyItems"), m.updateSettingsElementsAvailabilityClasses();
        var q = $(j.mainShellId + " #" + a).find(".listItem, .settingsSelectorCompactPlaceholder");
        this.addDefaultHandlersToSettingsControls(q)
    }, a.prototype.addDefaultHandlersToSettingsControls = function(a) {
        var b = this;
        a.focus(function() {
            b.insidePlayer.enterElement(this), b.insideSettings.enterElement(this), b.insideControls.enterElement(this)
        }), a.blur(function() {
            b.insidePlayer.leaveElement(this), b.insideSettings.leaveElement(this), b.insideControls.leaveElement(this)
        }), a.bind("mousedown", this.clickFocusPreventer), a.bind("keypress", this.enterHandler)
    }, a.prototype.showControls = function() {
        $(j.mainShellId + " .playerMainShell").removeClass("hiddenOverlay"), l.lastShowControls = new Date, l.hiddenOverlay = !1
    }, a.prototype.hideControls = function() {
        $(j.mainShellId + " .playerMainShell").addClass("hiddenOverlay"), l.hiddenOverlay = !0
    }, a.prototype.activateCentralButton = function(a) {
        var b = $(j.mainShellId + " .overlayBtn:focus").length > 0;
        l.activeCentralButton && l.activeCentralButton.addClass("inactive"), "pause" == a ? l.activeCentralButton = $(j.mainShellId + " #pauseBtn") : "play" == a ? l.activeCentralButton = $(j.mainShellId + " #playBtn") : "stop" == a ? l.activeCentralButton = $(j.mainShellId + " #stopBtn") : "replay" == a ? l.activeCentralButton = $(j.mainShellId + " #replayBtn") : alert("Unimpled central button '" + a + "'"), l.activeCentralButton.removeClass("inactive"), b && l.activeCentralButton.focus()
    }, a.prototype.useCustomPlayIcon = function(a) {
        this.useCustomIcon("playBtn", a)
    }, a.prototype.useCustomPauseIcon = function(a) {
        this.useCustomIcon("pauseBtn", a)
    }, a.prototype.useCustomReplayIcon = function(a) {
        this.useCustomIcon("replayBtn", a)
    }, a.prototype.useCustomIcon = function(a, b) {
        var c = void 0 != b && "" != b,
            d = $(j.mainShellId + " #" + a);
        m.addOrRemoveClass(d, c, "useCustomIcon"), c && d.find(".customIcon").attr("src", b)
    }, a.prototype.setHbbtvPreviewImage = function(a, b) {
        var c = $(j.mainShellId + " #hbbTvOverlayImage");
        void 0 != a ? (c.on("error", function() {
            c.off("error"), c.attr("src", b)
        }), c.attr("src", a)) : void 0 != b && c.attr("src", b)
    }, a.prototype.setSkinVolumeActive = function(a) {
        k.debug("setting skinVolumeActive"), $(j.mainShellId + " #volumeBarFilledTrack").css("background", a)
    }, a.prototype.setIndexLineColor = function(a) {
        k.debug("setting indexLineColor" + a), m.indexLineColor = a
    }, a.prototype.showEditModeShell = function() {
        k.info("showing editModeShell"), $(j.mainShellId + " #editModeShell").css("display", "block")
    }, a.prototype.computeDraggingPosition = function(a, b, c, d, e) {
        var g, f = $(a);
        "horizontal" == b ? g = f.width() : "vertical" == b && (g = f.height());
        var h = e / g;
        return c + Math.max(0, Math.min(1, h)) * (d - c)
    }, a.prototype.updateVolumeBarWhileDragging = function(a, b, c) {
        var d = this.computeDraggingPosition(a, "vertical", 100, 0, b);
        j.setVolume(d, c)
    }, a.prototype.updateVolumeBar = function() {
        var a = j.getVolume();
        $(j.mainShellId + " #volumeBarThumb").css("bottom", a + "%"), $(j.mainShellId + " #volumeBarFilledTrack").css("height", a + "%"), j.isMuted() || 0 == j.getVolume() ? ($(j.mainShellId + " #volumeShell #volumeBtn-0").css("display", "block"), $(j.mainShellId + " #volumeShell #volumeBtn-50").css("display", "none"), $(j.mainShellId + " #volumeShell #volumeBtn-100").css("display", "none")) : j.getVolume() > 50 ? ($(j.mainShellId + " #volumeShell #volumeBtn-0").css("display", "none"), $(j.mainShellId + " #volumeShell #volumeBtn-50").css("display", "none"), $(j.mainShellId + " #volumeShell #volumeBtn-100").css("display", "block")) : ($(j.mainShellId + " #volumeShell #volumeBtn-0").css("display", "none"), $(j.mainShellId + " #volumeShell #volumeBtn-50").css("display", "block"), $(j.mainShellId + " #volumeShell #volumeBtn-100").css("display", "none"))
    }, a.prototype.updateSeekBar = function(a, b, c) {
        var d = $(j.mainShellId + " #seekBar")[0];
        void 0 == a && (a = t.currentTime), void 0 == b && (b = d.min), void 0 == c && (c = d.max), l.updateSeekBarInternal(a, b, c)
    }, a.prototype.updateSeekBarInternal = function(a, b, c) {
        if (!j.isLive() || j.isTimeshift) {
            var d = $(j.mainShellId + " #seekBar")[0];
            d.min = b, d.max = c, a = Math.max(b, a), d.value = a, this.updateSeekBarLine(j.mainShellId + " .seekElapsed", a);
            var e = $(j.mainShellId + " #seekBarShell");
            e.removeClass("lowSeekBarValue"), e.removeClass("highSeekBarValue");
            var f = $(j.mainShellId + " .seekBarTimeInfo");
            if (j.isLive()) {
                var g = Math.max(j.timeShiftOffset, c - a + j.timeShiftOffset);
                f.html("-" + this.buildTimeString(g))
            } else f.html(this.buildTimeString(a));
            var h = $(j.mainShellId + " #remainingTimeInfo");
            j.isLive() ? h.html("") : h.html("-" + this.buildTimeString(c - a));
            $(j.mainShellId + " .seekNonElapsed").width() < 56 ? e.addClass("highSeekBarValue") : e.addClass("lowSeekBarValue"), this.updateSeekBarBufferedLine()
        }
    }, a.prototype.updateSeekBarBufferedLine = function() {
        var b, a = t.buffered;
        b = 0 == a.length ? 0 : a.end(a.length - 1), this.updateSeekBarLine(j.mainShellId + " .seekBuffered", b)
    }, a.prototype.updateSeekBarLine = function(a, b) {
        var c = $(j.mainShellId + " #seekBar")[0],
            d = b - c.min,
            e = 100 * d / (c.max - c.min);
        $(a).css("width", e + "%")
    }, a.prototype.countSeekBarFillWidth = function(a, b, c) {
        return a * c / b
    }, a.prototype.buildTimeString = function(a) {
        a = Math.round(a);
        var b = a % 60,
            c = (a - b) / 60,
            d = c % 60,
            e = (c - d) / 60;
        return b < 10 && (b = "0" + b), 0 == e ? d + ":" + b : (d < 10 && (d = "0" + d), e + ":" + d + ":" + b)
    }, a.prototype.updateEditModeValue = function(a) {
        var b = Math.round(a),
            c = Math.floor(b / 60),
            d = b % 60;
        d < 10 && (d = "0" + d), $(j.mainShellId + " #editModeShell")[0].textContent = c + ":" + d
    }, a.prototype.showPreviewImage = function(a) {
        if (void 0 != j.currentItem) {
            var b = j.currentItem.getPreviewTrackBaseUrl();
            if ((!j.isLive() || j.isTimeshift) && "audio" != j.settings.uimode) {
                var c = $(j.mainShellId + " #seekBarTouchArea"),
                    d = c.width(),
                    e = j.getStreamRange(),
                    f = e.min,
                    g = e.max,
                    h = g - f,
                    i = a / d * h + f;
                i = Math.min(i, g), i = Math.max(i, f);
                var k, o, p, m = 72,
                    n = m * j.currentItem.getAspect();
                if (void 0 !== b && !j.settings.hidePreviewTrack) {
                    var q, r, s;
                    if (j.isTimeshift) {
                        var t = g - i,
                            u = (new Date).getTime() / 1e3 - j.timeShiftOffset - t;
                        u += 6, r = Math.ceil(u / 5), q = 500 * Math.floor(r / 100), s = r % 100
                    } else {
                        var v = i + j.currentItem.getUrlStartOffset();
                        r = Math.ceil(v / 5), q = Math.floor(r / 100), s = r - 100 * q
                    }
                    o = s % 10 * n, p = Math.floor(s / 10) * m, k = b + q + ".jpg"
                }
                var w;
                if (j.isLive()) {
                    var x = g - i + j.timeShiftOffset;
                    w = "-" + l.buildTimeString(x)
                } else w = l.buildTimeString(i - f);
                l.showPreviewOrIndexImage(a, "white", k, o, p, w, void 0, n, m)
            }
        }
    }, a.prototype.showPreviewOrIndexImage = function(a, b, c, d, e, f, g, h, i) {
        var k = $(j.mainShellId + " #seekBarArea"),
            l = k.width(),
            n = l - h,
            o = k.offset().left - $(j.mainShellId + " #videoWrapper").offset().left,
            p = Math.max(0, Math.min(l, a)) + o,
            q = $(j.mainShellId + " #seekBarCursor");
        q.css("display", "block"), q.css("background", b), q.css("left", p + "px");
        var r = $(j.mainShellId + " #previewImage");
        if (r.empty(), r.css("visibility", "hidden"), void 0 != c) {
            var s = $("<img/>");
            s.attr("src", c), s.load(function() {
                void 0 != d && void 0 != e ? r.css("background", "url(" + c + ") no-repeat -" + d + "px -" + e + "px") : (r.css("background", ""), r.append(s)), r.css("visibility", "visible")
            })
        }
        $(j.mainShellId + " #previewImageTimeText")[0].textContent = f, r.width(h), r.height(i);
        var t = a - h / 2;
        j.settings.disableSmartPreviewImagePositioning || (t = Math.max(Math.min(n, t), 0)), t += o;
        var u = $(j.mainShellId + " #previewImageShell");
        m.addOrRemoveClass(u, void 0 != c, "hasPreviewImage"), u.width(h), u.css("left", t + "px"), u.css("display", "inline");
        var v = $(j.mainShellId + " #previewImageText");
        if (void 0 == g) v.css("display", "none");
        else {
            v.css("display", "block"), v.text(g);
            var w = 7,
                x = 14,
                y = 1.2,
                z = w * x * y;
            if (v.height() > z)
                for (var A = g.split(" "); A.length > 0 && (A.pop(), v.text(A.join(" ") + " ..."), !(v.height() <= z)););
        }
    }, a.prototype.hidePreviewImage = function() {
        $(j.mainShellId + " #previewImageShell").css("display", "none"), $(j.mainShellId + " #seekBarCursor").css("display", "none")
    }, a.prototype.updateSubtitles = function() {
        if (void 0 != l.subtitleCues && void 0 != j.currentItem) {
            var a = t.currentTime + j.currentItem.getUrlStartOffset();
            (l.currentCueIndex < 0 || l.currentCueIndex > l.subtitleCues.length) && (l.currentCueIndex = l.countCurrentCueIndex(a));
            var b;
            b = l.currentCueIndex > 0 ? l.subtitleCues[l.currentCueIndex - 1] : {
                endTime: "0"
            }, a < b.endTime && (l.currentCueIndex = l.countCurrentCueIndex(a));
            var c;
            l.currentCueIndex < l.subtitleCues.length && (c = l.subtitleCues[l.currentCueIndex], a > c.endTime && (l.currentCueIndex = l.countCurrentCueIndex(a))), c = l.currentCueIndex < l.subtitleCues.length ? l.subtitleCues[l.currentCueIndex] : void 0, void 0 == c ? l.clearDisplayedCue() : a > c.startTime ? l.displayCue(c) : l.clearDisplayedCue()
        }
    }, a.prototype.countCurrentCueIndex = function(a) {
        if (0 == l.subtitleCues.length) return 0;
        var b = 0,
            c = l.subtitleCues[0];
        if (c.endTime > a) return b;
        for (b = 1; b < l.subtitleCues.length;) {
            var d = c;
            if (c = l.subtitleCues[b], d.endTime < a && c.endTime > a) return b;
            b++
        }
        return b
    }, a.prototype.clearDisplayedCue = function() {
        l.displayedCueIndex = void 0, $(j.mainShellId + " #subtitlesShell").empty()
    }, a.prototype.displayCue = function(a) {
        if (k.debug("display cue"), l.currentCueIndex != l.displayedCueIndex) {
            $(j.mainShellId + " #subtitlesShell").empty();
            a.text.split("\n").forEach(function(a) {
                $(j.mainShellId + " #subtitlesShell").append($("<div/>", {
                    class: "subtitlesLine"
                }).append($("<span/>").text(a)))
            }), l.displayedCueIndex = l.currentCueIndex
        }
    }, a.prototype.setupSkipOverlay = function(a) {
        if ("audio" != j.settings.uimode) {
            k.info("SETTING SKIP OVERLAY");
            var b = $(j.mainShellId + " #skipShell");
            b.addClass("skipActive"), b.removeClass("canSkip"), l.skipCountDownTotal = a, l.skipCountDownOn = !0, l.updateSkipOverlay(0), l.skipOverlayDisplayed = !0
        }
    }, a.prototype.updateSkipOverlay = function(a) {
        if (l.skipCountDownOn) {
            var b = l.skipCountDownTotal - Math.floor(a);
            if (b > 0) $(j.mainShellId + " #skipSecsLeft")[0].textContent = "za " + l.formatCountDownString(b);
            else {
                $(j.mainShellId + " #skipShell").addClass("canSkip"), l.skipCountDownOn = !1
            }
        }
    }, a.prototype.hideSkipOverlay = function() {
        var a = $(j.mainShellId + " #skipShell");
        a.removeClass("skipActive"), a.removeClass("canSkip"), l.skipCountDownOn = !1, l.skipOverlayDisplayed = !1
    }, a.prototype.formatCountDownString = function(a) {
        var b = a + " sekund";
        return 1 == a ? b += "u" : a < 5 && (b += "y"), b
    }, a.prototype.setupNextInSeries = function(a, b, c) {
        k.info("setupNextInSeries", a, b), l.nextSeriesCountDownValue = a, l.updateNextInSeriesCountDown(), l.nextInSeriesCountDownInterval = setInterval(function() {
            l.nextSeriesCountDownValue -= 1, 0 == l.nextSeriesCountDownValue && (clearInterval(l.nextInSeriesCountDownInterval), j.playNextInSeries(c)), l.updateNextInSeriesCountDown()
        }, 1e3), $(j.mainShellId + " #skipNextInCountdownSvg").css("animation", "nextInSeriesDash " + a + "s linear forwards"), $(j.mainShellId + " #nextInSeriesLine2").text(b);
        var d = $(j.mainShellId + " #nextInSeriesBackground");
        void 0 != c.setup && void 0 != c.setup.previewImageUrl ? (d.attr("src", c.setup.previewImageUrl), d.css("display", "block")) : d.css("display", "none")
    }, a.prototype.updateNextInSeriesCountDown = function() {
        k.debug("updateNextInSeriesCountDown", l.nextSeriesCountDownValue), $(j.mainShellId + " #secsLeft")[0].textContent = l.formatCountDownString(l.nextSeriesCountDownValue)
    }, a.prototype.onTimeUpdate = function(a) {
        if (l.lastReportedVideoTime == t.currentTime || j.waitingForStream || (l.lastReportedVideoTime = t.currentTime, "error" == j.currentScreenName && j.showVideoScreen(), j.cancelScheduledVideoErrorScreen()), l.updateSkipOverlay(t.currentTime), j.isTimeshift || l.updateSeekBar(), m.forceSeekBarRepaint) {
            var b = $(j.mainShellId + " #seekBar")[0];
            l.updateSeekBarInternal(b.max, b.min, b.max), m.forceSeekBarRepaint = !1
        }
        j.editMode && l.updateEditModeValue(j.previousItemsTotalTime() + t.currentTime), l.updateSubtitles(), j.sendTrackingEvents()
    }, a.prototype.onBufferProgress = function(a) {
        this.updateSeekBarBufferedLine()
    }, a.prototype.setSubtitlesTrack = function(a) {
        this.subtitleCues = void 0, this.currentCueIndex = void 0, this.clearDisplayedCue();
        var b = $(j.mainShellId + " #audioShell #subtitlesShell");
        if (m.addOrRemoveClass(b, void 0 != a, "hasSubtitles"), this.waitingForSubtitles = a, void 0 != a) {
            var c = this;
            j.currentItem.getSubtitlesLoader(a).callWhenReady(function(b) {
                c.subtitlesTrackLoaded(a, b)
            })
        }
    }, a.prototype.subtitlesTrackLoaded = function(a, b) {
        this.waitingForSubtitles == a ? (k.info("Got subtitles", a), this.subtitleCues = b, this.currentCueIndex = 0, this.updateSubtitles()) : k.info("Ignoring late subtitles", a)
    }, a.prototype.displayVersionInformation = function() {
        $(j.mainShellId + " #versionInfoTextArea").text(j.version), $(j.mainShellId + " #settingsInfoTextArea").text(JSON.stringify(j.settings, null, 2)), $(j.mainShellId + " #playlistInfoTextArea").text(JSON.stringify(n.ct_playlist, null, 2)), $(j.mainShellId + " #versionInfoShell").css("display", "block")
    }, a.prototype.hideVersionInformation = function() {
        $(j.mainShellId + " #versionInfoShell").css("display", "none")
    }, a.prototype.formatAddTvCodeInput = function(a) {
        function b(a) {
            return a.replace(/[^0-9]/g, "")
        }

        function c(a) {
            return b(a).length
        }

        function d(a) {
            return a.match(/([0-9]{1,3})/g).join(" ")
        }
        void 0 == this.lastTvCodeInputDigitCount && (this.lastTvCodeInputDigits = 0);
        var e = $(a).val(),
            f = /^[0-9 ]*$/.test(e),
            g = c(e),
            h = g > this.lastTvCodeInputDigitCount;
        if (this.lastTvCodeInputDigitCount = g, f && h) {
            var i = a.selectionStart || 0,
                j = c(e.substring(0, i)),
                k = b(e),
                l = e.match(/( *)$/)[0];
            $(a).val(d(k) + l), a.selectionStart = a.selectionEnd = j + Math.floor(j / 3)
        }
    }, c.prototype.roundShellPadding = function(a) {
        if ("audio" != j.settings.uimode) {
            var b = $(j.mainShellId),
                c = b[0].getBoundingClientRect().width;
            if (c != this.currentMainShellWidth || a) {
                this.currentMainShellWidth = c;
                var d = $(j.mainShellId + " .playerMainShell");
                if (j.isFullScreen) return d.css("height", ""), void d.css("padding", "");
                var e = 2 * Math.floor(this.currentMainShellWidth / 2),
                    f = (this.currentMainShellWidth - e) / 2,
                    g = 9 / 16 * e,
                    h = 2 * Math.floor(g / 2);
                h < g && (h += 2), d.height(h), d.css("padding", "0 " + f + "px"), k.info("shell width ", this.currentMainShellWidth, "height", h, ", padding ", f, b, d)
            }
        }
    }, c.prototype.setContainerSize = function() {
        if ("audio" != j.settings.uimode && j.playerFormatted) {
            k.info("setContainerSize"), m.playerWidth = $(j.mainShellId + " #videoShell").width();
            var a;
            j.isFullScreen && void 0 != j.currentItem && (a = j.currentItem.getAspect()), void 0 == a && (a = 16 / 9), m.playerHeight = m.playerWidth / a;
            var c = ($(j.mainShellId + " #video"), $(j.mainShellId + " #videoWrapper"));
            j.isFullScreen ? j.fullScreenContainer.height() * a > j.fullScreenContainer.width() ? (c.css("width", "100%"), c.css("height", j.fullScreenContainer.width() / a + "px")) : (c.css("width", j.fullScreenContainer.height() * a + "px"), c.css("height", "100%")) : (c.css("width", ""), c.css("height", "")), k.info("new dimensions: w " + m.playerWidth + ", h " + m.playerHeight + ", a " + a)
        }
    }, c.prototype.checkResize = function() {
        j.playerFormatted && $(j.mainShellId + " #videoShell").width() != this.playerWidth && (this.setContainerSize(), this.format())
    }, c.prototype.transformVideo = function(a, b) {
        if (j.video.style.transform = "", j.video.style.msTransform = "", j.video.style.MozTransform = "", j.video.style.webkitTransform = "", a) {
            var c = 1 / (1 - a / 100);
            j.video.style.msTransform += "scaleX(" + c + ")", j.video.style.MozTransform += "scaleX(" + c + ")", j.video.style.webkitTransform += "scaleX(" + c + ")"
        }
        if (b) {
            var d = 1 / (1 - b / 100);
            j.video.style.msTransform += "scaleY(" + d + ")", j.video.style.MozTransform += "scaleY(" + d + ")", j.video.style.webkitTransform += "scaleY(" + d + ")"
        }
    }, c.prototype.onSeekRangeChanged = function(a) {
        var b = a.start || 0,
            c = a.end || (j.isTimeshift ? j.timeShiftDuration : t.duration);
        m.updateSeekBarRange(b, c)
    }, c.prototype.updateSeekBarRange = function(a, b) {
        var c = $(j.mainShellId + " #seekBar")[0];
        c.min = a, c.max = b, m.formatTotalTime()
    }, c.prototype.formatTotalTime = function() {
        var a = $(j.mainShellId + " #seekBar")[0],
            b = $(j.mainShellId + " #totalTimeInfo");
        if (isNaN(a.max) || j.isLive()) b[0].textContent = "";
        else {
            var c = l.buildTimeString(a.max);
            b[0].textContent = c
        }
    }, c.prototype.format = function() {
        var a = j.isPC,
            b = !j.isLive(),
            c = 1 == j.isTimeshift;
        if (k.debug("Formatting buttons"), m.formatVideoButtons(a, b, c), m.formatTimeShift(b, c), k.debug("Formatting time info"), m.formatTotalTime(), a || ($(j.mainShellId + " #videoShell").removeClass("controlsExited"), $(j.mainShellId + " .playerMainShell").addClass("mobilePlayer")), "audio" != j.settings.uimode) {
            var d = $(j.mainShellId + " #videoWrapper").width();
            k.info("Formatting breakpoint values ", d), m.setControlsIconsLarge(!a), j.settings.fixedLayout ? (m.setBreakpointLevel(1), m.setSettingsLayout(1), m.setAddTvLayout(1), m.setSubtitlesLayout(2), m.setErrorLayout(1), m.setNextInSeriesLayout(1)) : d >= 1180 ? (a ? (m.setBreakpointLevel(1), m.setSettingsLayout(1), m.setAddTvLayout(1)) : (m.setBreakpointLevel(2), m.setSettingsLayout(2), m.setAddTvLayout(2)), m.setSubtitlesLayout(2), m.setErrorLayout(1), m.setNextInSeriesLayout(1)) : d >= 940 ? (a ? (m.setBreakpointLevel(1), m.setSettingsLayout(1), m.setAddTvLayout(1)) : (m.setBreakpointLevel(2), m.setSettingsLayout(2), m.setAddTvLayout(2)), m.setSubtitlesLayout(4), m.setErrorLayout(1), m.setNextInSeriesLayout(2)) : d >= 593 ? (a ? (m.setSettingsLayout(2), m.setAddTvLayout(2)) : (m.setSettingsLayout(3), m.setAddTvLayout(4)), m.setBreakpointLevel(2), m.setSubtitlesLayout(5), m.setErrorLayout(1), m.setNextInSeriesLayout(3)) : d >= 540 ? (a ? m.setAddTvLayout(3) : m.setAddTvLayout(4), m.setBreakpointLevel(2), m.setSettingsLayout(3), m.setSubtitlesLayout(5), m.setErrorLayout(1), m.setNextInSeriesLayout(4)) : d >= 480 ? (m.setSubtitlesLayout(7), m.setBreakpointLevel(3), m.setSettingsLayout(3), m.setAddTvLayout(6), m.setErrorLayout(1), m.setNextInSeriesLayout(4)) : (m.setSubtitlesLayout(8), m.setBreakpointLevel(3), m.setSettingsLayout(4), m.setAddTvLayout(6), m.setErrorLayout(2), m.setNextInSeriesLayout(4))
        }
        m.formatHbbtv(), m.addOrRemoveClass($(j.mainShellId + " .playerMainShell"), j.isThisNewWindow, "inNewWindow")
    }, c.prototype.setSubtitlesLayout = function(a) {
        var b = $(j.mainShellId + " #overlay"),
            c = $(j.mainShellId + " #subtitlesShell"),
            d = $(j.mainShellId + " #gradientsWrapper");
        this.setOneOfClasses(b, "subtitlesLayout", a, 8), this.setOneOfClasses(c, "subtitlesLayout", a, 8), this.setOneOfClasses(d, "subtitlesLayout", a, 8)
    }, c.prototype.setErrorLayout = function(a) {
        var b = $(j.mainShellId + " .playerMainShell");
        this.setOneOfClasses(b, "errorLayout", a, 2)
    }, c.prototype.setNextInSeriesLayout = function(a) {
        var b = $(j.mainShellId + " .playerMainShell");
        this.setOneOfClasses(b, "nextInSeriesLayout", a, 4)
    }, c.prototype.setBreakpointLevel = function(a) {
        var b = $(j.mainShellId + " .playerMainShell");
        this.setOneOfClasses(b, "breakpoint", a, 3), m.formatIndexes()
    }, c.prototype.setSettingsLayout = function(a) {
        var b = $(j.mainShellId + " #settingsDiv");
        this.setOneOfClasses($(j.mainShellId + " .playerMainShell"), "settingsLayout", a, 4);
        var c = b.find("#leftColumn .columnContent"),
            d = b.find("#rightColumn .columnContent"),
            e = b.find("#settingsHbbtv").detach(),
            f = b.find("#settingsSubtitles").detach(),
            g = b.find("#settingsAudio").detach(),
            h = b.find("#settingsQuality").detach();
        switch (a) {
            case 1:
            case 2:
                e.appendTo(c), e.removeClass("dropDown"), f.appendTo(c), f.addClass("dropDown"), g.appendTo(c), g.addClass("dropDown"), h.appendTo(d), h.removeClass("dropDown");
                break;
            case 3:
                e.appendTo(c), e.removeClass("dropDown"), f.appendTo(d), f.addClass("dropDown"), g.appendTo(d), g.addClass("dropDown"), h.appendTo(d), h.addClass("dropDown");
                break;
            case 4:
                e.appendTo(c), e.addClass("dropDown"), f.appendTo(c), f.addClass("dropDown"), g.appendTo(c), g.addClass("dropDown"), h.appendTo(c), h.addClass("dropDown")
        }
        this.updateSettingsElementsAvailabilityClasses(), this.currentSettingsLayout = a, this.recenterSettings()
    }, c.prototype.recenterSettings = function() {
        var a = $(j.mainShellId + " #settingsDiv"),
            b = $(j.mainShellId + " #videoWrapper"),
            c = $(j.mainShellId + " #settingsShell"),
            d = $(j.mainShellId + " #settingsQuality .settingsSelector"),
            e = $(j.mainShellId + " #settingsDiv #leftColumn");
        if (0 != c.width() && 0 != d.width() && !j.settings.fixedLayout) {
            if (!(1 == this.currentSettingsLayout || 2 == this.currentSettingsLayout && 0 == e.width())) return void a.css("right", "");
            var g = b.offset().left + b.width(),
                h = c.offset().left + c.width() / 2,
                i = g - h,
                k = a.offset().left + a.width(),
                l = d.offset().left + d.width() / 2,
                m = k - l,
                n = i - m;
            n < 4 && (n = 4), a.css("right", n + "px")
        }
    }, c.prototype.setAddTvLayout = function(a) {
        this.setOneOfClasses($(j.mainShellId + " #settingsDiv"), "addTvLayout", a, 6)
    }, c.prototype.closeSettingsDropDowns = function() {
        $(j.mainShellId + " .settingsElement").removeClass("dropDownOpen"), $(j.mainShellId + " #settingsDiv").removeClass("anyDropDownOpen"), $(j.mainShellId + " #settingsDiv").addClass("noDropDownOpen")
    }, c.prototype.openSettingsDropDown = function(a) {
        var b = $(a).closest(".settingsElement"),
            c = b.find(":focus").length > 0;
        this.closeSettingsDropDowns(), b.addClass("dropDownOpen"), $(j.mainShellId + " #settingsDiv").removeClass("noDropDownOpen"), $(j.mainShellId + " #settingsDiv").addClass("anyDropDownOpen"), c && b.find(".settingsSelectorList .listItem")[0].focus()
    }, c.prototype.setControlsIconsLarge = function(a) {
        var b = $(j.mainShellId + " .playerMainShell");
        a ? (b.removeClass("smallControlsIcons"), b.addClass("largeControlsIcons")) : (b.removeClass("largeControlsIcons"), b.addClass("smallControlsIcons"))
    }, c.prototype.formatVideoButtons = function(a, b, c) {
        $(j.mainShellId + " #volumeShell").css("display", j.settings.audioControlHidden ? "none" : "inline-block"), $(j.mainShellId + " #volumeButtons").css("display", j.settings.audioControlHidden ? "none" : "inline-block"), $(j.mainShellId + " #settingsShell").css("display", "inline-block")
    }, c.prototype.formatTimeShift = function(a, b) {
        $(j.mainShellId + " #liveShell").css("display", a ? "none" : "inline-block"), $(j.mainShellId + " #backInTimeShell").css("display", a || b || !j.settings.enableDVR ? "none" : "inline-block"), b ? ($(j.mainShellId + " #liveShell").removeClass("isLive"), $(j.mainShellId + " #liveShell").attr("title", "Živě"), $(j.mainShellId + " #liveShell").attr("aria-label", "Živě")) : ($(j.mainShellId + " #liveShell").addClass("isLive"), $(j.mainShellId + " #liveShell").removeAttr("title"), $(j.mainShellId + " #liveShell").removeAttr("aria-label")), a || b ? $(j.mainShellId + " #seekBarShell").css("display", "block") : $(j.mainShellId + " #seekBarShell").css("display", "none")
    }, c.prototype.formatIndexes = function() {
        if (void 0 != j.currentItem) {
            var a = $(j.mainShellId + " #seekBarTouchArea"),
                b = j.currentItem.getIndexes();
            $(j.mainShellId + " .seekBarIndex").remove();
            for (var c = j.getStreamRange(), d = 0; d < b.length; d++) m.addFormattedIndex(b[d], c, a.width())
        }
    }, c.prototype.addFormattedIndex = function(a, b, c) {
        var d = $("<div/>", {
            class: "seekBarIndex"
        });
        d.insertAfter($(j.mainShellId + " #seekBarTouchArea")), d.css("background", m.indexLineColor), d.css("left", (a.time - b.min) / (b.max - b.min) * 100 + "%"), d[0].addEventListener("mouseenter", function(b) {
            var c = $(b.target).position().left + 1;
            l.showPreviewOrIndexImage(c, m.indexLineColor, a.imageUrl, void 0, void 0, l.buildTimeString(a.time), a.title, 128, 72)
        }), d[0].addEventListener("mouseleave", function(a) {
            l.hidePreviewImage()
        }), $(d[0]).click(function(b) {
            j.seekToIndex(a.time)
        })
    }, c.prototype.setFullScreenButtonIcon = function(a) {
        $(j.mainShellId + " #fullScreenShell").attr("title", a ? "Zrušit celou obrazovku" : "Na celou obrazovku"), $(j.mainShellId + " #fullScreenShell").attr("aria-label", a ? "Zrušit celou obrazovku" : "Na celou obrazovku"), $(j.mainShellId + " #fullScreenBtn #fullScreen").css("display", a ? "none" : "inline-block"), $(j.mainShellId + " #fullScreenBtn #smallScreen").css("display", a ? "inline-block" : "none")
    }, c.prototype.setupForLoadedSource = function() {
        k.info("filling settings div with info about loaded stream"), m.format(), "full" == j.settings.uimode ? (m.formatHbbtvSelector(), m.formatSubtitlesSelector(), m.formatAudioSelector(), m.formatQualitySelector()) : (m.updateAudioSubtitles(j.getSubtitlesInfo()), $(j.mainShellId + " #seekBarShell").addClass("audioLoaded")), m.setupForVast(j.currentItem.isVast), m.formatHbbtv(), m.formatClickThrough(), l.updateSeekBar(), k.info("setup over", j.video.currentTime)
    }, c.prototype.setupForVast = function(a) {
        m.addOrRemoveClass($(j.mainShellId + " .playerMainShell"), a, "isVast")
    }, c.prototype.formatClickThrough = function() {
        var a = "playing" == j.playerStatus,
            b = void 0 != j.currentItem.getClickThroughUrl();
        m.addOrRemoveClass($(j.mainShellId + " #overlay"), a && b, "clickThrough")
    }, c.prototype.formatHbbtv = function() {
        var a = this;
        if (this.formatHbbtvSelector(), 0 == j.getAvailTVsInfo().length) $(j.mainShellId + " #hbbTvShell").css("display", "none");
        else {
            $(j.mainShellId + " #hbbTvShell").css("display", "inline-block");
            var b = $(j.mainShellId + " #hbbTvList");
            b.empty(), j.getAvailTVsInfo().forEach(function(c) {
                var d = c.id == j.selectedTvId,
                    e = '<div class="listItem';
                d && (e += " selectedListItem"), e += '">' + c.name, d && (e += '<svg><use xlink:href="#icon-ico-tv-linked"></use></svg>'), e += "</div>";
                var f = $(e);
                f.appendTo(b), f.bind("click", function(b) {
                    b.stopPropagation(), j.activateHbbTv(c.id), a.deactivateScreen("hbbTv")
                })
            })
        }
        var c;
        if (void 0 != j.selectedTvName) {
            var d = "Přehrávání na " + j.selectedTvName;
            $(j.mainShellId + " #hbbTvPlaying").text(d), c = d
        } else c = "Přehrát na TV";
        k.debug("hbbtvToolTip", c), $(j.mainShellId + " #hbbTvShell").attr("title", c), $(j.mainShellId + " #hbbTvShell").attr("aria-label", c), this.addOrRemoveClass($(j.mainShellId + " .playerMainShell"), void 0 != j.selectedTvId, "hbbTvActive"), this.recenterSettings()
    }, c.prototype.formatHbbtvSelector = function() {
        l.setSettingsListItems("settingsHbbtv", j.getAvailTVsInfo(), m.formatHbbtvItem, m.hbbtvItemSelected, 0, "TV"), $(j.mainShellId + " #settingsPairedTvCount").text(j.getAvailTVsInfo().length)
    }, c.prototype.formatHbbtvItem = function(a) {
        var b = "Odebrat " + a.name,
            c = "<span>" + a.name + '</span><div class="listItemIcon hbbTvSettingsItemLinkedIcon"><svg><use xlink:href="#icon-ico-tv-linked"></use></svg></div><div class="listItemIcon hbbTvSettingsItemRemoveIcon" id="removeHbbtvIcon-' + a.id + '" tabindex="4" title="' + b + '" aria-label="' + b + '" aria-role="button"><svg><use xlink:href="#icon-ico-tv-remove"></use></svg></div><div class="listItemIcon hbbTvSettingsItemLoadingIcon"><div><div class="loadingAnimationCircle"></div></div></div>';
        return {
            value: a.id,
            text: c,
            selected: a.id == j.selectedTvId,
            label: a.name,
            iconHandlers: {
                hbbTvSettingsItemRemoveIcon: function(a, b) {
                    var c = this,
                        d = $(j.mainShellId + " #removeTvConfirm");
                    d.off("click"), d.on("click", function() {
                        j.removeHbbtvDevice(a), m.deactivateSettingsInnerPage(), $(this).is(":focus") && c.focus()
                    });
                    var e = $(j.mainShellId + " #removeTvCancel");
                    e.off("click"), e.on("click", function() {
                        m.deactivateSettingsInnerPage(), $(this).is(":focus") && c.focus()
                    }), this.is(":focus") && d.focus(), m.activateSettingsInnerPage("removeTvActive"), b.stopPropagation(), b.preventDefault()
                }
            }
        }
    }, c.prototype.hbbtvItemSelected = function(a) {
        void 0 == j.selectedTvId ? j.activateHbbTv(a) : j.deactivateHbbTv()
    }, c.prototype.formatSubtitlesSelector = function() {
        var a = j.getSubtitlesInfo().slice(),
            b = {
                value: "subtitlesOff",
                language: void 0,
                text: "Vypnuty"
            };
        a.unshift(b), l.setSettingsListItems("settingsSubtitles", a, m.formatSubtitlesItem, m.subtitlesItemSelected, 2, "Titulky")
    }, c.prototype.formatSubtitlesItem = function(a) {
        k.debug("Formating subtitles", a);
        var b = $("<div/>");
        b.append($("<span/>", {
            class: "fullText"
        }).text(a.text));
        var c = void 0 == a.language ? "Vyp." : a.language.toUpperCase();
        return b.append($("<span/>", {
            class: "shortText"
        }).text(c)), {
            value: a.language,
            text: b.html(),
            selected: a.language == j.selectedSubtitles,
            label: a.text
        }
    }, c.prototype.subtitlesItemSelected = function(a) {
        k.info("Selected subtitles", a), j.selectSubtitles(a)
    }, c.prototype.formatAudioSelector = function() {
        var a = j.getAudioTracks();
        l.setSettingsListItems("settingsAudio", a, m.formatAudioItem, m.audioItemSelected, 2, "Zvuková stopa")
    }, c.prototype.formatAudioItem = function(a, b) {
        var c;
        c = void 0 == j.currentAudioTrack ? 0 == b : a.value == j.currentAudioTrack;
        var d = $("<div/>");
        return d.append($("<span/>", {
            class: "fullText"
        }).text(a.text)), d.append($("<span/>", {
            class: "shortText"
        }).text(a.value.toUpperCase())), {
            value: a.value,
            text: d.html(),
            selected: c,
            label: a.text
        }
    }, c.prototype.audioItemSelected = function(a) {
        k.info("audioItemSelected", a), j.setAudioTrack(a)
    }, c.prototype.formatQualitySelector = function() {
        var a = j.getQualityInfo();
        l.setSettingsListItems("settingsQuality", a, m.formatQualityItem, m.qualityItemSelected, 0, "Kvalita"), this.recenterSettings()
    }, c.prototype.updateAutoQualityText = function(a) {
        $(j.mainShellId + " .autoQualityResolution").text(a)
    }, c.prototype.formatQualityItem = function(a) {
        var c, d, b = $("<div/>");
        "auto" == a.key ? (c = "", d = "Auto") : (c = a.resolution, d = j.getQualityResolutionText(c)), b.append($("<span/>", {
            class: "name"
        }).text(d));
        var e = $("<span/>", {
            class: "value"
        }).text(c);
        return "auto" == a.key && e.addClass("autoQualityResolution"), b.append(e), {
            value: a.key,
            text: b.html(),
            selected: a.key == j.currentQuality,
            label: d
        }
    }, c.prototype.qualityItemSelected = function(a) {
        k.info("Quality select ", a), j.manualSetQuality(a)
    }, c.prototype.updateAudioSubtitles = function(a) {
        var b = $(j.mainShellId + " #audioSubtitlesShell");
        0 == a.length ? b.addClass("empty") : b.removeClass("empty")
    }, c.prototype.activateReplayScreen = function(a) {
        var b = $(j.mainShellId + " .playerMainShell");
        a ? b.addClass("replayScreenActive") : b.removeClass("replayScreenActive"), l.hidePreviewImage()
    }, c.prototype.showReplayPoster = function() {
        var a = $(j.mainShellId + " #replayPosterWrapper");
        a.find("#replayPoster").remove(), void 0 != n && void 0 != n.getPreviewImageUrl() && $("<img/>", {
            id: "replayPoster",
            src: n.getPreviewImageUrl()
        }).appendTo(a)
    }, c.prototype.activateScreen = function(a, b) {
        if (void 0 != this.activeScreen) {
            if (this.activeScreen == a) return void k.debug("screen " + a + " already active");
            k.info("deactivating screen " + this.activeScreen + " before activating " + a), this.deactivateScreen(this.activeScreen)
        }
        if (void 0 != a) {
            k.info("activating screen ", a);
            $(j.mainShellId + " .playerMainShell").addClass(a + "ScreenActive"), this.screenOnDeactivate = b
        }
        this.activeScreen = a
    }, c.prototype.deactivateScreen = function(a) {
        if (void 0 != this.activeScreen && this.activeScreen == a) {
            k.info("deactivating screen ", a);
            $(j.mainShellId + " .playerMainShell").removeClass(a + "ScreenActive"), this.activeScreen = void 0;
            var c = this.screenOnDeactivate;
            this.screenOnDeactivate = void 0, void 0 != c && c.call()
        } else k.debug("screen " + a + " already not active")
    }, c.prototype.toggleScreenActive = function(a, b) {
        void 0 != this.activeScreen && this.activeScreen == a ? this.deactivateScreen(a) : this.activateScreen(a, b)
    }, c.prototype.activateSettingsScreen = function() {
        var a = this;
        this.activateScreen("settings", function() {
            a.closeSettingsDropDowns(), $(j.mainShellId + " #settingsDiv *").blur()
        }), this.recenterSettings()
    }, c.prototype.getActiveScreen = function() {
        return this.activeScreen
    }, c.prototype.activateSettingsInnerPage = function(a) {
        m.closeSettingsDropDowns();
        var b = $(j.mainShellId + " #settingsDiv");
        b.addClass("innerPageActive " + a), b.removeClass("innerPageNotActive"), this.activeSettingsInnerPage = a
    }, c.prototype.deactivateSettingsInnerPage = function() {
        var a = $(j.mainShellId + " #settingsDiv");
        a.removeClass("innerPageActive addTvActive removeTvActive"), a.addClass("innerPageNotActive"), this.activeSettingsInnerPage = void 0
    }, c.prototype.closeSettings = function() {
        this.deactivateScreen("settings"), l.showControls()
    }, c.prototype.updateSettingsElementsAvailabilityClasses = function() {
        $(j.mainShellId + " .columnContent").get().forEach(function(a) {
            for (var b = $(a).children(".settingsElement:not(.notAvailable)"), c = 0; c < b.length; c++) {
                var d = $(b[c]);
                this.addOrRemoveClass(d, 0 == c, "firstAvailable"), this.addOrRemoveClass(d, c == b.length - 1, "lastAvailable")
            }
            var e = $(a).children(".settingsElement.notAvailable");
            e.removeClass("firstAvailable"), e.removeClass("lastAvailable")
        }, this)
    }, c.prototype.addOrRemoveClass = function(a, b, c) {
        b ? a.addClass(c) : a.removeClass(c)
    }, c.prototype.setOneOfClasses = function(a, b, c, d) {
        for (var e = 1; e <= d; e++) {
            var f = b + e;
            e == c ? a.addClass(f) : a.removeClass(f)
        }
    };
    var d = '\r\n    <div id="subtitlesShell">\r\n\t</div>\x3c!--subtitlesShell--\x3e',
        e = '\r\n    <div id="volumeButtons" class="videoButtonShell focusableBtn dontHideControls" title="Zvuk" aria-role="button" aria-label="Zvuk" tabindex="5">\r\n    \t<div id="volumeBtn-0" class="controlBtn">\r\n      \t\t<svg><use xlink:href="#icon-ico-volume-0"></use></svg>\r\n    \t</div>\r\n    \t<div id="volumeBtn-50" class="controlBtn">\r\n      \t\t<svg><use xlink:href="#icon-ico-volume-50"></use></svg>\r\n    \t</div>\r\n    \t<div id="volumeBtn-100" class="controlBtn">\r\n      \t\t<svg><use xlink:href="#icon-ico-volume-100"></use></svg>\r\n    \t</div>\r\n\t</div>\x3c!-- volumeButtons --\x3e',
        f = '\r\n    <div id="seekBarShell">\r\n\t\t<span id="totalTimeInfo"></span>\r\n    \t<span id="remainingTimeInfo"></span>\r\n    \t<div id="seekBarTrackShell">\r\n      \t\t<div id="seekBarArea">\r\n        \t\t<div class="seekBuffered">\r\n          \t\t\t<div class="seekBarLine">\r\n            \t\t\t<div>&nbsp;</div>\r\n          \t\t\t</div>\r\n        \t\t</div>\r\n        \t\t<div class="seekElapsed">\r\n          \t\t\t<span class="seekBarTimeInfo"></span>\r\n          \t\t\t<div class="seekBarLine">\r\n            \t\t\t<div>&nbsp;</div>\r\n          \t\t\t</div>\r\n          \t\t\t<div id="seekBarThumbCircle"></div>\r\n        \t\t</div>\r\n        \t\t<div class="seekNonElapsed">\r\n          \t\t\t<span class="seekBarTimeInfo"></span>\r\n          \t\t\t<div class="seekBarLine">\r\n            \t\t\t<div>&nbsp;</div>\r\n          \t\t\t</div>\r\n        \t\t</div>\r\n\t\t\t\t<form novalidate>\r\n\t\t  \t\t\t<div id="seekBarFocusTarget" class="dontHideControls" tabindex="2" aria-label="Časová osa"></div>\r\n          \t\t\t<input id="seekBar" type="range" step="any" min="0" max="1000" tabindex="-1"/>\r\n\t\t  \t\t\t<div id="seekBarTouchArea"></div>\r\n        \t\t</form>\r\n      \t\t</div>\r\n    \t</div>\r\n\t</div>\x3c!--seekBarShell--\x3e',
        g = '\r\n    <div id="volumeBarShell">\r\n    \t<div id="volumeBarContentsWrapper">\r\n      \t\t<div id="volumeBarContents">\r\n\t\t\t\t<div id="volumeBarTrack"></div>\r\n        \t\t<div id="volumeBarFilledTrack"></div>\r\n        \t\t<div id="volumeBarThumb">\r\n          \t\t\t<svg><use xlink:href="#icon-ico-volume-handle"></use></svg>\r\n        \t\t</div>\r\n        \t\t<div id="volumeBar"></div>\r\n      \t\t</div>\r\n    \t</div>\r\n\t</div>\x3c!--volumeBarShell--\x3e',
        h = '\r\n  <div id="videoShell" class="controlsExited" role="complementary" aria-label="Videopřehrávač">\r\n    <div id="videoWrapper">\r\n    <video id="video" crossorigin="anonymous" webkit-playsinline playsinline>\r\n    </video>\r\n\t<div id="replayPosterWrapper"></div>\r\n\t\r\n    <div id="hbbTvOverlay">\r\n      <img id="hbbTvOverlayImage"/>\r\n\t  <div id="hbbTvPlaying"></div>\r\n\t</div>\r\n\t<div id="gradientsWrapper">\r\n\t  <div id="gradientShell">\r\n\t  </div>\x3c!--gradientShell--\x3e\r\n\t  <div id="gradientShell2">\r\n\t  </div>\x3c!--gradientShell2--\x3e\r\n\t</div>\x3c!--gradientsWrapper--\x3e\r\n    <div id="overlay">\r\n      <div id="versionInfoOpener">\r\n      </div>\x3c!--versionInfoOpener--\x3e\r\n      <div id="controls">\r\n        <div id="videoButtons" class="dontDblClick">\r\n          <div id="settingsShell" class="videoButtonShell dontHideControls dontHideSettings cursorPointer focusableBtn" aria-role="button" aria-label="Nastavení" title="Nastavení" tabindex="3">\r\n            <div class="controlBtnBackground"></div>\r\n            <div id="settingsBtn" class="controlBtn">\r\n              <svg><use xlink:href="#icon-ico-settings"></use></svg>\r\n            </div>\r\n          </div>\x3c!--settingsShell--\x3e\r\n\r\n          <div id="volumeShell" class="dontHideControls cursorPointer">\r\n            <div class="controlBtnBackground"></div>' + g + e + '\r\n          </div>\x3c!-- volumeShell --\x3e\r\n          <div id="newWindowShell" class="videoButtonShell dontHideControls cursorPointer focusableBtn" title="Do nového okna" aria-role="button" aria-label="Do nového okna" tabindex="5">\r\n            <div id="newWindowBtn" class="controlBtn">\r\n              <svg><use xlink:href="#icon-ico-pop"></use></svg>\r\n            </div>\r\n          </div>\r\n          <div id="fullScreenShell" class="videoButtonShell dontHideControls cursorPointer focusableBtn" title="Na celou obrazovku" aria-role="button" aria-label="Na celou obrazovku" tabindex="5">\r\n            <div id="fullScreenBtn" class="controlBtn">\r\n              <svg id="fullScreen"><use xlink:href="#icon-ico-fullscreen"></use></svg>\r\n              <svg id="smallScreen" style="display: none"><use xlink:href="#icon-ico-smallscreen"></use></svg>\r\n            </div>\r\n          </div>\r\n          <div id="hbbTvShell" class="videoButtonShell dontHideControls cursorPointer focusableBtn" title="Přehrát na TV" aria-role="button" aria-label="Přehrát na TV" tabindex="5">\r\n            <div class="controlBtnBackground"></div>\r\n            <div id="hbbTvBtn" class="controlBtn">\r\n              <svg id="linked"><use xlink:href="#icon-ico-tv-linked"></use></svg>\r\n              <svg id="disconnected"><use xlink:href="#icon-ico-tv-disconnected"></use></svg>\r\n            </div>\r\n\t        <div id="hbbTvListArea">\r\n\t          <div id="hbbTvListTitle">Vybrat TV</div>\r\n\t          <div id="hbbTvList">\r\n\t          </div>\r\n\t        </div>\r\n          </div>\r\n        </div>\x3c!--videoButtons--\x3e\r\n        <div id="seekBarAndSwitch" class="dontDblClick dontHideControls">\r\n          <div id="timeShiftButtons">\r\n            <div id="backInTimeShell" class="videoButtonShell cursorPointer dontDblClick focusableBtn" title="Zpět v čase" aria-role="button" aria-label="Zpět v čase" tabindex="2">\r\n              <div id="backInTimeButton" class="controlBtn">\r\n                <span id="backInTimeImage">\r\n                  <svg><use xlink:href="#icon-ico-timeshift"></use></svg>\r\n                </span>\r\n                <span id="backInTimeBtn">ZPĚT V ČASE</span>\r\n              </div>\x3c!--backInTimeButton--\x3e\r\n            </div>\r\n            <div id="liveShell" class="videoButtonShell isLive cursorPointer dontDblClick focusableBtn" tabindex="2" aria-role="button" aria-label="Živě" title="Živě">\r\n              <div id="liveButton" class="controlBtn">\r\n  \t            <div class="controlBtnBackground active"></div>\r\n                <span id="liveImage"></span>\r\n                <span id="liveBtn">ŽIVĚ</span>\r\n              </div>\r\n            </div>\r\n          </div>\x3c!-- timeShiftButtons --\x3e' + f + '\r\n        </div>\x3c!--seekBarAndSwitch--\x3e\r\n      </div>\x3c!--controls--\x3e\r\n      <div id="playBtn" aria-role="button" aria-label="Spustit" title="Spustit" class="autoPlayElement overlayBtn systemBtn inactive dontHideControls cursorPointer focusableBtn" tabindex="1">\r\n        <svg class="circle"><use xlink:href="#icon-ico-circle-big"></use></svg>\r\n        <svg class="icon"><use xlink:href="#icon-ico-play-big"></use></svg>\r\n\t\t<img class="customIcon" />\r\n\t  </div>\r\n      <div id="pauseBtn" aria-role="button" aria-label="Pauza" title="Pauza" class="overlayBtn systemBtn inactive dontHideControls cursorPointer focusableBtn" tabindex="1">\r\n        <svg class="circle"><use xlink:href="#icon-ico-circle-big"></use></svg>\r\n        <svg class="icon"><use xlink:href="#icon-ico-pause-big"></use></svg>\r\n\t\t<img class="customIcon" />\r\n      </div>\r\n      <div id="replayBtn" aria-role="button" aria-label="Přehrát znovu" title="Přehrát znovu" class="overlayBtn systemBtn inactive dontHideControls cursorPointer focusableBtn" tabindex="1">\r\n        <svg class="circle"><use xlink:href="#icon-ico-circle-big"></use></svg>\r\n        <svg class="icon"><use xlink:href="#icon-ico-replay-big"></use></svg>\r\n\t\t<img class="customIcon" />\r\n      </div>\r\n      <div id="skipShell" tabindex="1" class="dontDblClick focusableBtn" aria-role="button" aria-label="Přeskočit" title="Přeskočit">\r\n\t    <div id="skipContents">\r\n          <div id="skipText">Přeskočit</div>\r\n          <div id="skipSecsLeft"></div>\r\n          <div id="skipBtn">\r\n\t        Přeskočit\r\n            <svg class="icon"><use xlink:href="#icon-ico-skip"></use></svg>\r\n          </div>\r\n        </div>\r\n      </div> \x3c!--skipShell--\x3e\r\n      <div id="afterTimeShift" class="dontDblClick">\r\n      <svg id="afterTimeShiftSvg1"><use xlink:href="#icon-ico-after-timeshift-1"></use></svg> \r\n      <svg id="afterTimeShiftSvg2"><use xlink:href="#icon-ico-after-timeshift-2"></use></svg> \r\n      <svg id="afterTimeShiftSvg3"><use xlink:href="#icon-ico-after-timeshift-3"></use></svg> \r\n      <svg id="afterTimeShiftSvg4"><use xlink:href="#icon-ico-after-timeshift-4"></use></svg> \r\n      </div>\r\n      <div id="seekBarCursor"></div>\r\n\r\n\t  <div id="settingsDiv" class="innerPageNotActive noDropDownOpen dontDblClick dontHideControls dontHideSettings">\r\n            <div id="settingsContentWrapper">\r\n              <div id="settingsContentScroller">\r\n              <div id="settingsContent">\r\n                <div id="leftColumn" class="settingsColumn">\r\n                  <div class="columnContent">\r\n                  </div>\r\n                </div>\r\n                <div id="rightColumn" class="settingsColumn">\r\n                  <div class="columnContent">\r\n                  </div>\r\n                </div>\r\n\t\t\t\t<div id="settingsInnerPage">\r\n\t\t\t\t  <div id="settingsInnerPageContents">\r\n                  <div id="addTvDiv">\r\n                    <div id="addTvStep1" class="addTvStep">\r\n                      <span class="addTvStepIcon">\r\n                        <svg><use xlink:href="#icon-ico-bullet"></use></svg>\r\n                        1\r\n                      </span>\r\n                      <span class="addTvStepText">Zapněte TV a&nbsp;stiskněte červené tlačítko na&nbsp;ovladači.</span>\r\n                    </div>\r\n                    <div id="addTvStep2" class="addTvStep">\r\n                      <span class="addTvStepIcon">\r\n                        <svg><use xlink:href="#icon-ico-bullet"></use></svg>\r\n                        2\r\n                      </span>\r\n                      <span class="addTvStepText">Stiskněte na&nbsp;ovladači číslo&nbsp;8</span>\r\n                    </div>\r\n                    <div id="addTvStep3" class="addTvStep">\r\n                      <span class="addTvStepIcon">\r\n                        <svg><use xlink:href="#icon-ico-bullet"></use></svg>\r\n                        3\r\n                      </span>\r\n                      <span class="addTvStepText">Zadejte kód z&nbsp;TV:</span>\r\n                      <form id="addTvCodeInputShell" novalidate>\r\n                        <input id="addTvCodeInput" type="tel" class="dontHideControls dontHideSettings" tabindex="4" autocomplete="off">\r\n\t\t\t\t\t\t<div id="addTvCodeSubmit" class="settingsBtn focusableBtn dontHideControls dontHideSettings cursorPointer " tabindex="4" title="PřidatTV" aria-label="Přidat TV" aria-role="button">Přidat</div>\r\n                      </form>\r\n                    </div>\r\n                    <div id="addTvInfo" class="settingsLink">\r\n                      <a id="addTvHelpLink" target="_blank" href="http://www.ceskatelevize.cz/hbbtv/" class="addTvStepIcon dontHideControls dontHideSettings">\r\n                        <svg><use xlink:href="#icon-ico-bullet"></use></svg>\r\n                        <svg id="addTvInfoIcon"><use xlink:href="#icon-ico-info"></use></svg>\r\n                      </a>\r\n                      <span class="addTvStepText">\r\n                        <a id="addTvHelpLink" target="_blank" href="http://www.ceskatelevize.cz/hbbtv/" class="dontHideControls dontHideSettings" tabindex="4">TV musí být připojena k&nbsp;internetu\r\n                        a&nbsp;podporovat HbbTV. Více info&nbsp;&gt;</a>\r\n                      </span>\r\n                    </div>\r\n                  </div>\x3c!--addTvDiv--\x3e\r\n\t\t\t\t  <div id="removeTvDiv">\r\n\t\t\t\t\t<div id="removeTvTitle">Chcete skutečně TV odebrat?</div>\r\n\t\t\t\t\t<div id="removeTvInfo">Budete-li chtít přehrávat videa na této televizi pomocí mobilu nebo počítače, budete ji muset znovu přidat.</div>\r\n\t\t\t\t\t<div id="removeTvConfirm" class="settingsBtn focusableBtn dontHideControls dontHideSettings cursorPointer" aria-role="button" aria-label="Odebrat TV" title="Odebrat TV" tabindex="4">Odebrat TV</div>\r\n\t\t\t\t\t<div id="removeTvCancel" class="settingsLink focusableBtn dontHideControls dontHideSettings cursorPointer" aria-role="button" aria-label="Nechci odebrat TV" title="Nechci odebrat TV" tabindex="4">Neodebírat</div>\r\n\t\t\t\t  </div>\r\n\t\t\t\t</div>\x3c!--settingsInnerPageContents--\x3e\r\n\t\t\t\t</div>\x3c!--settingsInnerPage--\x3e\r\n              </div>\r\n\t      <div id="settingsHbbtv" class="settingsElement">\r\n\t        <div class="settingsElementTitle">Přehrát na TV</div>\r\n                <div id="hbbtvWrapper" class="settingsElementContents">\r\n                  <div class="settingsSelectorShell">\r\n                    <div class="settingsSelector" tabindex="-1">\r\n                      <div class="settingsSelectorPlaceholder"></div>\r\n                      <div class="settingsSelectorList" aria-role="listbox"></div>\r\n                      <div class="settingsElementArrows">\r\n\t\t        <svg class="arrowUp"><use xlink:href="#icon-ico-arrow-up"></use></svg>\r\n\t\t        <svg class="arrowDown"><use xlink:href="#icon-ico-arrow-down"></use></svg>\r\n                      </div>\x3c!--settingsElementArrows--\x3e\r\n                    </div>\r\n                  </div>\r\n\t\t\t  <div id="settingsPairedTvInfo" class="dontHideSettings dontHideControls cursorPointer focusableBtn" tabindex="4" aria-role="button" aria-label="Spárované TV" title="Spárované TV">\r\n\t\t\t\t<div>\r\n\t\t\t\t  Přidané&nbsp;TV\r\n\t\t\t\t  <div id="settingsPairedTvCount"></div>\r\n\t\t\t\t</div>\r\n\t\t\t  </div>\r\n\t          <div id="addTvBtn" class="settingsBtn dontHideSettings dontHideControls focusableBtn" tabindex="4" aria-role="button" aria-label="Přidat TV" title="Přidat TV">\r\n                <span>Přidat&nbsp;TV</span>\r\n              </div>\r\n\t\t\t  <div id="compactAddTvBtn" class="dontHideSettings dontHideControls focusableBtn" tabindex="4" aria-role="button" aria-label="Přidat TV" title="Přidat TV">\r\n\t\t\t\t<div>Přidat&nbsp;TV</div>\r\n\t\t\t  </div>\r\n                </div>\r\n\t\t\t<div class="settingsElementBottomTitle">Přehrát na TV</div>\r\n\t      </div>\x3c!--settingsHbbtv--\x3e\r\n\t      <div id="settingsSubtitles" class="settingsElement">\r\n\t        <div class="settingsElementTitle">Titulky</div>\r\n                <div class="settingsSelectorShell settingsElementContents">\r\n                  <div class="settingsSelector" tabindex="-1">\r\n                    <div class="settingsSelectorPlaceholder"></div>\r\n                    <div class="settingsSelectorList" aria-role="listbox"></div>\r\n                    <div class="settingsElementArrows">\r\n\t\t      \t\t  <svg class="arrowUp"><use xlink:href="#icon-ico-arrow-up"></use></svg>\r\n\t\t\t\t\t  <svg class="arrowDown"><use xlink:href="#icon-ico-arrow-down"></use></svg>\r\n\t\t\t\t\t  <svg class="arrowRight"><use xlink:href="#icon-ico-arrow-right"></use></svg>\r\n                    </div>\x3c!--settingsElementArrows--\x3e\r\n\t\t\t\t\t<div class="settingsSelectorCompactPlaceholder" class="dontHideSettings dontHideControls cursorPointer focusableBtn" tabindex="4" aria-role="button" aria-label="Titulky" title="Titulky">\r\n\t\t\t\t\t  <div class="settingsSelectorCompactPlaceholderContents"></div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<select class="settingsNativeSelect" title="Titulky" aria-label="Titulky" tabindex="-1"></select>\r\n                  </div>\r\n                </div>\r\n\t\t\t<div class="settingsElementBottomTitle">Titulky</div>\r\n\t      </div>\x3c!--settingsSubtitles--\x3e\r\n\t      <div id="settingsAudio" class="settingsElement">\r\n\t        <div class="settingsElementTitle">Zvuková stopa</div>\r\n                <div class="settingsSelectorShell settingsElementContents">\r\n                  <div class="settingsSelector" tabindex="-1">\r\n                    <div class="settingsSelectorPlaceholder"></div>\r\n                    <div class="settingsSelectorList" aria-role="listbox"></div>\r\n                    <div class="settingsElementArrows">\r\n\t\t\t\t\t  <svg class="arrowUp"><use xlink:href="#icon-ico-arrow-up"></use></svg>\r\n\t\t\t\t\t  <svg class="arrowDown"><use xlink:href="#icon-ico-arrow-down"></use></svg>\r\n\t\t\t\t\t  <svg class="arrowRight"><use xlink:href="#icon-ico-arrow-right"></use></svg>\r\n                    </div>\x3c!--settingsElementArrows--\x3e\r\n\t\t\t\t    <div class="settingsSelectorCompactPlaceholder" class="dontHideSettings dontHideControls cursorPointer focusableBtn" tabindex="4" aria-role="button" aria-label="Zvuková stopa" title="Zvuková stopa">\r\n\t\t\t\t\t  <div class="settingsSelectorCompactPlaceholderContents"></div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<select class="settingsNativeSelect" title="Zvuková stopa" aria-label="Zvuková stopa" tabindex="-1"></select>\r\n                  </div>\r\n                </div>\r\n\t\t\t<div class="settingsElementBottomTitle">Zvuk</div>\r\n\t      </div>\x3c!--settingsAudio--\x3e\r\n\t      <div id="settingsQuality" class="settingsElement">\r\n\t        <div class="settingsElementTitle">Kvalita</div>\r\n                <div class="settingsSelectorShell settingsElementContents">\r\n                  <div class="settingsSelector" tabindex="-1">\r\n                    <div class="settingsSelectorPlaceholder"></div>\r\n                    <div class="settingsSelectorList" aria-role="listbox"></div>\r\n                    <div class="settingsElementArrows">\r\n\t\t\t\t\t  <svg class="arrowUp"><use xlink:href="#icon-ico-arrow-up"></use></svg>\r\n\t\t\t\t\t  <svg class="arrowDown"><use xlink:href="#icon-ico-arrow-down"></use></svg>\r\n\t\t\t\t\t  <svg class="arrowRight"><use xlink:href="#icon-ico-arrow-right"></use></svg>\r\n                    </div>\x3c!--settingsElementArrows--\x3e\r\n\t\t\t\t\t<div class="settingsSelectorCompactPlaceholder" class="dontHideSettings dontHideControls cursorPointer focusableBtn" tabindex="4" aria-role="button" aria-label="Kvalita" title="Kvalita">\r\n\t\t\t\t\t  <div class="settingsSelectorCompactPlaceholderContents"></div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<select class="settingsNativeSelect" title="Kvalita" aria-label="Kvalita" tabindex="-1"></select>\r\n                  </div>\r\n                </div>\r\n\t\t\t<div class="settingsElementBottomTitle">Kvalita</div>\r\n\t      </div>\x3c!--settingsQuality--\x3e\r\n            </div>\x3c!--settingsContentScroller--\x3e\r\n\t    </div>\x3c!--settingsContentWrapper--\x3e\r\n            <div id="settingsControls" class="cursorPointer">\r\n              <div id="settingsCloseButton" class="dontHideControls dontHideSettings focusableBtn" aria-role="button" aria-label="Zavřít" title="Zavřít" tabindex="4">\r\n                <svg><use xlink:href="#icon-ico-close"></use></svg>\r\n              </div>\r\n            </div>\r\n\t  </div>\x3c!--settingsDiv--\x3e\r\n          <div>\r\n\t    <div id="previewImageShell">\r\n              <div id="previewImageText"></div>\r\n\t      <div id="previewImage"></div>\r\n              <div id="previewImageTime"><span id="previewImageTimeText">00:00</span></div>\r\n\t    </div>\r\n          </div>\r\n\r\n    </div>\x3c!--overlay--\x3e\r\n\r\n        <div id="editModeShell">\r\n          0:00\r\n        </div>' + d + '\r\n\t</div> \x3c!-- videoWrapper --\x3e\r\n\r\n    <div id="nextInSeriesOverlay">\r\n\t  <img id="nextInSeriesBackground" />\r\n\t  <div id="nextInSeriesContent">\r\n\t\t  <div id="nextInSeriesLine1">Další díl</div>\r\n\t\t  <div id="nextInSeriesLine2">Budu ve tvých vzpomínkách</div>\r\n\t\t  <div id="nextInSeriesLine3">\r\n\t\t    <span id="willBePlayed">se přehraje za</span>\r\n\t\t    <span id="secsLeft">10 sekund</span>\r\n\t\t  </div>\r\n\t\t  <div id="nextInSeriesLine4">\r\n\t  \t    <div id="nextInSeriesButtonShell">\r\n\t    \t  <div id="nextInSeriesBtn" class="cursorPointer">Nepřehrávat další díl</div>\r\n\t\t      <svg id="skipNextInCountdownSvg">\r\n\t\t\t\t<path d="M102,2 l96,0 a4,4,0,0,1,4,4 l0,44 a4,4,0,0,1,-4,4 l-192,0 a4,4,0,0,1,-4,-4 l0,-44 a4,4,0,0,1,4,-4 l96,0"/>\r\n\t\t \t  </svg>\r\n\t\t    </div>\r\n\t    \t  <div id="middleSeriesReplayBtn" aria-role="button" aria-label="Přehrát znovu" title="Přehrát znovu" class="seriesReplayBtn dontHideControls cursorPointer focusableBtn" tabindex="1">\r\n\t    \t\t<svg class="circle"><use xlink:href="#icon-ico-circle-big"></use></svg>\r\n\t    \t\t<svg class="icon"><use xlink:href="#icon-ico-replay-big"></use></svg>\r\n\t\t\t  </div>\r\n\t\t    </div>\r\n\t  </div>\x3c!-- nextInSeriesContent --\x3e\r\n        </div>\x3c!--nextInSeriesOverlay--\x3e\r\n\r\n        <div id="loadingOverlay" class="dontDblClick">\r\n          <div class="loadingAnimationCircle"></div>\r\n          <div id="loadingAnimationText">Nahrávám video...</div>\r\n          <div id="loadingAnimationBar"></div>\r\n        </div>\x3c!--loadingOverlay--\x3e\r\n\r\n        <div id="errorOverlay">\r\n\t      <div id="errorVerticalAligner">\r\n            <div id="errorIcon">\r\n              <svg><use xlink:href="#icon-ico-error-general"></use></svg>\r\n             </div>\r\n            <div id="errorLine1">Omlouváme se, něco se pokazilo...</div>\r\n\t\t\t<div id="errorLine2">Dostali jsme zprávu o chybě a co nejdřív se na to podíváme.</div>\r\n            <div id="errorButtonsShell">\r\n              <div id="errorReloadShell">\r\n                <div id="errorReloadIcon" class="errorSmallIcon">\r\n                  <svg class="circle"><use xlink:href="#icon-ico-circle-big"></use></svg>\r\n                  <svg class="icon"><use xlink:href="#icon-ico-replay"></use></svg>\r\n                \x3c!-- no whitespace --\x3e</div><div id="errorReloadText" class="errorButtonText">znovu načíst</div>\r\n              </div>\r\n              <div id="errorHelpShell">\r\n                <div id="errorHelpIcon" class="errorSmallIcon">\r\n                  <svg class="circle"><use xlink:href="#icon-ico-circle-big"></use></svg>\r\n                  <svg class="icon"><use xlink:href="#icon-ico-help"></use></svg>\r\n\t              \x3c!-- no whitespace --\x3e</div><div id="errorHelpText" class="errorButtonText">nápověda k přehrávači</div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\x3c!--errorOverlay--\x3e\r\n      </div>\x3c!--videoShell--\x3e\r\n\r\n      <div id="versionInfoShell">\r\n\t\t<div id="errorDetail"></div>\r\n        <div id="versionShell">\r\n          <div id="versionInfoLabel">version</div>\r\n          <textarea id="versionInfoTextArea" rows="1" cols="9"></textarea>\r\n        </div>\r\n        <div id="hideVersionInfoBtn">X</div>\r\n        <div id="settingsInfoShell">\r\n          <div id="settingsInfoLabel">settings</div>\r\n          <textarea id="settingsInfoTextArea" rows="40" cols="80"></textarea>\r\n        </div>\r\n        <div id="playlistInfoShell">\r\n          <div id="playlistInfoLabel">playlist</div>\r\n          <textarea id="playlistInfoTextArea" rows="40" cols="80"></textarea>\r\n        </div>\r\n      </div>\x3c!--versionInfoShell--\x3e\r\n\r\n\t  <div id="newWindowFormShell"></div>\r\n',
        i = '\r\n      <div id="audioShell" role="complementary" aria-label="Audiopřehrávač">\r\n        <video id="video" crossorigin="anonymous" style="display: none;">\r\n        </video>' + d + '\r\n        <div id="audioPlayerControlsShell">\r\n          <div id="audioPlayStopBtnShell">\r\n            <div id="audioPlayBtn" class="controlBtn audioBtn1 focusableBtn" tabindex="1" aria-role="button" aria-label="Spustit" title="Spustit" >\r\n               <svg><use xlink:href="#icon-ico-play"></use></svg>\r\n            </div>\r\n            <div id="audioStopBtn" class="controlBtn audioBtn1 focusableBtn" tabindex="1" aria-role="button" aria-label="Pauza" title="Pauza" >\r\n               <svg><use xlink:href="#icon-ico-pause"></use></svg>\r\n            </div>\r\n            <div id="audioReplayBtn" class="controlBtn audioBtn1 focusableBtn" tabindex="1" aria-role="button" aria-label="Přehrát znovu" title="Přehrát znovu" >\r\n               <svg><use xlink:href="#icon-ico-replay"></use></svg>\r\n            </div>\r\n          </div>\r\n          <div id="audioSubtitlesShell" class="focusableBtn empty" tabindex="6" title="Titulky" aria-role="button" aria-label="Titulky">\r\n\t        <div id="settingsSubtitles">\r\n              <div class="settingsSelectorList" aria-role="listbox"></div>\r\n\t        </div>\r\n            <div id="audioSubtitlesBtn">Tit.</div>\r\n          </div>\r\n          <div id="volumeShell">' + g + e + "\r\n          </div>" + f + "\r\n        </div>\x3c!--audioPlayerControlsShell--\x3e\r\n\r\n      </div>\x3c!--audioShell--\x3e\r\n",
        j = new p,
        k = null,
        l = null,
        m = null,
        n = null,
        o = null;
    p.prototype.setCompiled = function(a) {
        this.compiled = a
    }, p.prototype.init = function(a, b, c, d) {
        k = new B(b.logLevel), k.info("PlayerMgr.init: start"), j.videoErrorScreenTimerHolder = new y(this.showErrorScreen), j.longBufferingErrorScreenTimerHolder = new y(this.showErrorScreen), j.timeShiftOffset = b.dvrBarDisableLastNSecs, void 0 == j.timeShiftOffset && (j.timeShiftOffset = 180), j.timeShiftDuration = b.dvrBarDuration, void 0 == j.timeShiftDuration && (j.timeShiftDuration = 10800), j.volumeBeforeMute = 100, j.isThisNewWindow = void 0 != d, j.newWindowData = d;
        var e;
        if (void 0 === c) {
            var f = j.compiled ? "player.js" : "playerLoader.js",
                g = $('script[src*="' + f + '"]');
            if (g.length > 0) {
                var l = g.attr("src");
                e = l.substring(0, l.lastIndexOf("/") + 1), k.info("path: '" + e + "'; path param was NOT present - using src dir of " + f)
            }
        } else e = c, k.info("path: '" + e + "'; path param present");
        var o = e.replace(/\/$/, ""),
            p = b.svgSprite;
        void 0 == p && (p = "sprite.svg"), $.ajax(e + p, {
            beforeSend: function() {}
        }).success(function(a) {
            var b = document.createElement("div");
            b.innerHTML = "string" == typeof a ? a : (new XMLSerializer).serializeToString(a.documentElement), $(b).css("display", "none"), document.body.insertBefore(b, document.body.childNodes[0])
        }), k.info("Settings:", b), j.settings = b, j.initHbbtv(), j.mainShellId = a;
        var q = $(a);
        q.empty();
        var r = {
                skinButtonForeground: "#b32025",
                indexLineColor: "#f0f300",
                dvrBarElapsedTimeLineColor: "#b32025",
                timeFontColor: "#ffffff",
                skinColorIconPlayer: "#ffffff"
            },
            s = j.settings.gaTrackingId;
        void 0 == s && (s = "UA-63458229-1"), "" != s && (ga("create", s, "auto", "player"), ga("send", "pageview"));
        var t = ["param.css"];
        j.settings.additionalCss && t.push(j.settings.additionalCss);
        var u = [],
            v = [],
            w = new A,
            x = j.compiled ? "index.min.css" : "index.css";
        w.loadFile(e + x, function(a, b) {
            b = b.replace(/URL_BASE/g, o), u[0] = b
        }), t.forEach(function(a, b) {
            w.loadFile(e + a, function(a, c) {
                c = c.replace(/URL_BASE/g, o), c = c.replace(/PARAM_(\w+)/g, function(a, b) {
                    var c = j.settings[b];
                    return void 0 == c && (c = r[b]), c
                }), v[b] = c
            })
        }), w.callAfterAllReady(function() {
            [u, v].forEach(function(a) {
                a.forEach(function(a) {
                    void 0 != a && $("head").append("<style>" + a + "</style>")
                })
            })
        });
        var z;
        if ("full" == j.settings.uimode) z = h, $(j.mainShellId).css("overflow", "hidden");
        else {
            if ("audio" != j.settings.uimode) return void k.warn("flashvars.uimode not set");
            z = i, $(j.mainShellId).css("overflow", "visible")
        }
        var C;
        if (C = "audio" == j.settings.uimode ? 40 : q.width() / (16 / 9), j.isThisNewWindow) {
            var D = C - window.innerHeight;
            0 != D && window.resizeBy(0, D)
        }
        var E = $.parseHTML(z),
            F = $("<div/>", {
                class: "playerMainShell hiddenOverlay",
                style: "visibility: hidden; width: 0; height: " + C + "px; overflow: hidden;",
                tabindex: 1
            });
        F.append(E), q.append(F), F.focus(), j.playerInserted(), w.callAfterAllReady(function() {
            F.removeAttr("style"), j.playerFormatted = !0, m.roundShellPadding(!0), m.checkResize()
        });
        var G = {
            getPlayerAudioTrackList: function() {
                var a = [];
                return j.getAudioTracks().forEach(function(b) {
                    a.push(b.language)
                }), a
            },
            getPlayerSubtitleTrackList: function() {
                var a = [];
                return j.getSubtitlesInfo().forEach(function(b) {
                    a.push(b.language)
                }), a
            },
            getPlayerLevels: function() {
                var a = [];
                return j.getQualityInfo().forEach(function(b) {
                    a.push(b.key)
                }), a
            },
            setPlayerAudioTrack: function(a) {
                return j.setAudioTrack(a, !0)
            },
            setPlayerSubtitleTrack: function(a) {
                return j.selectSubtitles(a, !0)
            },
            setPlayerLevel: function(a) {
                return j.setQuality(a)
            },
            getStreamPosition: function() {
                return j.getStreamPosition()
            },
            play: function() {
                j.play(!0)
            },
            pause: function() {
                j.pause(!0)
            },
            stop: function() {
                j.stop(!0)
            },
            seek: function(a) {
                a /= 1e3, j.isLive() ? j.isTimeshift && (k.debug("seek: ", j.getStreamRange().max + (a + j.timeShiftOffset), " against ", j.getStreamRange().max), j.seekTo(j.getStreamRange().max + (a + j.timeShiftOffset))) : j.seekTo(a)
            },
            fullScreen: function(a) {
                a != j.isFullScreen && j.toggleFullScreen(void 0, !0)
            },
            switchToLive: function() {
                j.isLive() && j.isTimeshift && j.switchTimeshift(!1)
            },
            switchToTimeshift: function(a, b) {
                j.isLive() && !j.isTimeshift && j.switchTimeshift(!0, a, b)
            },
            setAudioLevel: function(a) {
                j.setVolume(a, !0)
            },
            getCurrentPlaylistItem: function() {
                return j.getCurrentItemCanonicalIndex()
            },
            setPlaylistItem: function(a) {
                j.play_item(parseInt(a) + n.getPrerollItemCount(), !1, void 0, 0)
            }
        };
        return j.settings.extendedAPI && (G.loadPlaylist = function(a) {
            j.loadPlaylistWhenReady(a)
        }, G.getPlaylist = function() {
            return jQuery.extend(!0, {}, n.ct_playlist)
        }), G
    }, p.prototype.initHbbtv = function() {
        if (this.availTVsInfo = [], this.selectedTvId = void 0, this.selectedTvName = void 0, j.settings.hbbtvDisable) j.hbbtv = void 0, k.warn("HBBTV disabled");
        else if ("function" == typeof Remote) {
            var a = new Remote(!0, j.settings.mobilePlayer ? "Mobil" : "PC");
            j.hbbtv = a, a.onConnected = function() {
                j.hbbtvOnConnected()
            }, a.onConnectError = function() {
                j.hbbtvOnConnectError()
            }, a.onDisconnected = function() {
                j.hbbtvOnDisconnected()
            }, a.onCommand = function(a, b) {
                j.hbbtvOnCommand(a, b)
            }, a.onGetNewPairingId = function(a) {
                j.onGetNewPairingId(a)
            }, a.onPairDeviceResult = function(a) {
                j.hbbtvOnPairDeviceResult(a)
            }, a.onUpdatePairedDeviceStatus = function(a) {
                j.onUpdatePairedDeviceStatus(a)
            }
        } else j.hbbtv = void 0, k.error("HBBTV library NOT found")
    }, p.prototype.hbbtvOnConnected = function() {
        k.info("HBBTV connected"), this.updateAvailTVs()
    }, p.prototype.hbbtvOnConnectError = function() {
        k.error("HBBTV CONNECT ERROR")
    }, p.prototype.hbbtvOnDisconnected = function() {
        k.error("HBBTV DISCONNECTED"), void 0 != this.selectedTvId && this.doDeactivateHbbTv(), this.availTVsInfo = [], this.selectedTvId = void 0, this.selectedTvName = void 0, m.formatHbbtv()
    }, p.prototype.hbbtvOnCommand = function(a, b) {
        if (k.info("HBBTV command", a, b), void 0 == this.selectedTvId) return void k.warn("HBBTV command IGNORED, not in HBBTV mode");
        if (this.selectedTvId != a) return void k.warn("HBBTV command from'" + a + "' IGNORED, selected TV is", this.selectedTvId);
        this.activatingTv && (this.onHbbtvActivated(), this.activatingTv = !1);
        var c = b.data;
        switch (b.command) {
            case "playvideo":
                k.error("HBBTV playvideo command is not supported by player");
                break;
            case "pause":
                this.pause(!1, !0);
                break;
            case "play":
                this.play(!1, !0);
                break;
            case "stopvideo":
                void 0 == c.videodata ? k.warn("Ignoring stopvideo command without videodata") : this.hbbtvPlayerCookie != c.videodata.exparam ? k.info("Ignoring stopvideo from another player") : this.doDeactivateHbbTv();
                break;
            case "seek":
                var d = c.position / 1e3;
                this.seekTo(d, !0), this.hbbtvAutoSwitchTimeshift();
                break;
            case "live":
                this.switchTimeshift(!1, void 0, void 0, !0);
                break;
            case "setquality":
                this.hbbtvSetQuality(c.quality);
                break;
            case "setaudiostream":
                this.hbbtvSetAudiostream(c.audiostream);
                break;
            case "setsubtitles":
                this.hbbtvSetSubtitles(c.subtitles);
                break;
            case "skipad":
                k.warn("HBBTV skipad not implemented");
                break;
            case "playstate":
            case "playstatechange":
                var e;
                if (void 0 != (e = "AD" == c.videotype ? c.addata : c.videodata)) {
                    if (void 0 != e.duration ? this.lastKnownHbbtvDuration = e.duration / 1e3 : "LIVE" == c.videotype && (this.lastKnownHbbtvDuration = this.timeShiftDuration), void 0 != e.position) {
                        var f = e.position / 1e3;
                        this.storeHbbtvPosition(f, void 0)
                    }
                    if (void 0 != e.playstate) {
                        var g, h;
                        switch (e.playstate) {
                            case 1:
                                g = !0, h = !0;
                                break;
                            case 0:
                            case 2:
                            case 5:
                                g = !1, h = !1;
                                break;
                            case 3:
                            case 4:
                                g = !1, h = !0
                        }
                        h && "paused" == j.playerStatus ? this.play(!1, !0) : h || "playing" != j.playerStatus || this.pause(!1, !0), this.storeHbbtvPosition(void 0, g)
                    }
                    switch (c.videotype) {
                        case "AD":
                            this.lastKnownHbbtvIsVast = !0, this.lastKnownHbbtvTrack = void 0, this.lastKnownHbbtvStartOffset = 0;
                            break;
                        case "LIVE":
                            this.lastKnownHbbtvIsVast = !1, this.lastKnownHbbtvTrack = 0, this.lastKnownHbbtvStartOffset = 0 - (this.timeShiftDuration + this.timeShiftOffset);
                            break;
                        case "VOD":
                            this.lastKnownHbbtvIsVast = !1, this.lastKnownHbbtvTrack = e.track, this.lastKnownHbbtvStartOffset = 0
                    }
                    this.lastKnownHbbtvIsVast = "AD" == c.videotype, this.lastKnownHbbtvVideoType = c.videotype, this.hbbtvAutoSwitchTimeshift(), "AD" == c.videotype && void 0 != e.skipSecs ? this.hbbtvSkipAdDisplayed || (l.setupSkipOverlay(e.skipSecs), this.hbbtvSkipAdDisplayed = !0) : this.hbbtvSkipAdDisplayed && (l.hideSkipOverlay(), this.hbbtvSkipAdDisplayed = !1), this.formatHbbtvSeekBarAndVast(), void 0 != e.subtitles && this.hbbtvSetSubtitles(e.subtitles), void 0 != e.audiostream && this.hbbtvSetAudiostream(e.audiostream), void 0 != e.quality && (void 0 != e.qualities && this.maybeUpdateHbbtvQualitiesList(e.qualities, e.quality), this.hbbtvSetQuality(e.quality)), void 0 == this.pendingHbbtvSeek || 1 != e.playstate && 2 != e.playstate || (this.sendHbbtvSeek(this.pendingHbbtvSeek), this.pendingHbbtvSeek = void 0)
                }
                break;
            default:
                k.error("Unsupported HBBTV command", b.command)
        }
    }, p.prototype.hbbtvSetSubtitles = function(a) {
        var b;
        0 == a && (b = "cs"), b != this.selectedSubtitles && this.selectSubtitles(b, !1, !1, !0)
    }, p.prototype.maybeUpdateHbbtvQualitiesList = function(a, b) {
        var c = this,
            d = [];
        a.forEach(function(a) {
            d.push(a.replace(/^max/, ""))
        });
        var e = [];
        this.lastKnownHbbtvQualities.forEach(function(a) {
            e.push(a.key)
        }), d.join("-") != e.join("-") && (k.info("HBBTv qualities changed"), this.lastKnownHbbtvQualities = [], d.forEach(function(a) {
            c.lastKnownHbbtvQualities.push({
                id: a,
                key: a,
                resolution: a
            })
        }), this.currentQuality = b, m.formatQualitySelector())
    }, p.prototype.hbbtvSetQuality = function(a) {
        (a = a.replace(/^max/, "")) != this.currentQuality && this.setQuality(a, !0)
    }, p.prototype.hbbtvSetAudiostream = function(a) {
        var b;
        if ("main" == a) b = "cs";
        else {
            if ("audioDescription" != a) return;
            b = "ad"
        }
        b != this.currentAudioTrack && this.setAudioTrack(b, !1, !0)
    }, p.prototype.onGetNewPairingId = function(a) {
        k.error("Unsolicited HBBTV pairing ID", a)
    }, p.prototype.onUpdatePairedDeviceStatus = function(a) {
        k.info("HBBTV paired device status", a), this.updateAvailTVs()
    }, p.prototype.updateAvailTVs = function(a) {
        var b = this.hbbtv.getPairedOnline();
        k.info("getPairedOnline result:", b), this.availTVsInfo = [];
        var c = !1;
        for (var d in b) b.hasOwnProperty(d) && (this.availTVsInfo.push({
            id: d,
            name: b[d]
        }), d == this.selectedTvId && (c = !0));
        k.info("List of paired devices:", this.availTVsInfo), void 0 == this.selectedTvId || c || (k.info("Current TV not available"), this.doDeactivateHbbTv()), m.formatHbbtv()
    }, p.prototype.removeHbbtvDevice = function(a) {
        k.info("Removing HBBTv device", a), this.hbbtv.removePairedDevice(a), this.updateAvailTVs()
    }, p.prototype.activateHbbTv = function(a) {
        if (k.info("Activating HBBTv on device:", a), this.currentItem.isVast) this.lastKnownHbbtvPosition = 0, this.lastKnownHbbtvDuration = 0, this.lastKnownHbbtvStartOffset = 0, this.lastKnownHbbtvIsVast = !0;
        else if (this.isLive()) this.isTimeshift ? this.lastKnownHbbtvPosition = this.getStreamPosition() : this.lastKnownHbbtvPosition = 0, this.lastKnownHbbtvDuration = this.timeShiftDuration, this.lastKnownHbbtvStartOffset = 0 - (this.timeShiftDuration + this.timeShiftOffset), this.lastKnownHbbtvIsVast = !1;
        else {
            var b = this.getStreamRange();
            this.lastKnownHbbtvPosition = this.getStreamPosition(), this.lastKnownHbbtvDuration = b.max - b.min, this.lastKnownHbbtvStartOffset = 0, this.lastKnownHbbtvIsVast = !1
        }
        this.lastKnownHbbtvPlaying = !1, this.lastKnownHbbtvTrack = void 0, this.lastKnownHbbtvVideoType = void 0, this.lastKnownHbbtvAudioTracks = this.getAudioTracks(), this.lastKnownHbbtvSubtitles = this.getSubtitlesInfo(), this.lastHbbtvTimestamp = (new Date).getTime(), this.hbbtvSkipAdDisplayed = l.skipOverlayDisplayed, this.lastKnownHbbtvQualities = [];
        var c = {};
        this.hbbtvPlayerCookie = Math.floor(1e6 * Math.random()), c.exparam = this.hbbtvPlayerCookie, this.currentItem.isVast ? c.id = n.getPlaylistItem(0).getAssetId() : c.id = this.currentItem.getAssetId(), this.currentItem.isVast || (c.adprerolldisable = !0, c.track = this.getCurrentItemCanonicalIndex()), "cs" != this.currentAudioTrack && this.populateHbbtvSetAudioStreamCommand(c, this.currentAudioTrack), void 0 != this.selectedSubtitles && this.populateHbbtvSetSubtitlesCommand(c, this.selectedSubtitles), 0 != this.lastKnownHbbtvPosition ? this.pendingHbbtvSeek = this.lastKnownHbbtvPosition : this.pendingHbbtvSeek = void 0, "playing" == j.playerStatus && this.pause(!0), this.activatingTv = !0, this.selectedTvId = a, this.availTVsInfo.forEach(function(a) {
            a.id == this.selectedTvId && (this.selectedTvName = a.name)
        }, this), this.formatHbbtvSeekBarAndVast(), m.formatHbbtv(), this.sendHbbtvCommand("playvideo", c)
    }, p.prototype.onHbbtvActivated = function() {
        this.sendGemiusEvent("stopped"), o.unload()
    }, p.prototype.formatHbbtvSeekBarAndVast = function() {
        var a = this.lastKnownHbbtvStartOffset,
            b = a + this.lastKnownHbbtvDuration,
            c = this.computeHbbtvPosition();
        m.formatTimeShift(!this.isLive(), this.isTimeshift), m.updateSeekBarRange(a, b), m.setupForVast(this.lastKnownHbbtvIsVast), l.updateSeekBar(c), l.updateSkipOverlay(c)
    }, p.prototype.deactivateHbbTv = function() {
        this.sendHbbtvCommand("pause"), this.doDeactivateHbbTv()
    }, p.prototype.doDeactivateHbbTv = function() {
        k.info("Deactivating HBBTv on device:", this.selectedTvId);
        var a = this.computeHbbtvPosition();
        this.selectedTvId = void 0, this.selectedTvName = void 0, m.formatHbbtv();
        var b;
        b = void 0 == this.lastKnownHbbtvTrack ? 0 : this.getItemIndexFromCanonical(this.lastKnownHbbtvTrack);
        var c;
        c = n.getItem(b).isLive() || n.getItem(b).isVast ? void 0 : a, this.play_item(b, !1, !0, c), j.pauseTimestamp = (new Date).getTime()
    }, p.prototype.sendHbbtvCommand = function(a, b) {
        this.sendHbbtvCommandTo(this.selectedTvId, a, b)
    }, p.prototype.sendHbbtvCommandTo = function(a, b, c) {
        void 0 == c && (c = {});
        var d = {
            command: b,
            data: c
        };
        k.info("Sending HBBTv command to", a, d), this.hbbtv.sendCommand(a, d)
    }, p.prototype.sendHbbtvSeek = function(a) {
        this.storeHbbtvPosition(a, void 0), this.sendHbbtvCommand("seek", {
            position: 1e3 * a
        })
    }, p.prototype.sendHbbtvSetAudioStreamCommand = function(a) {
        var b = {};
        this.populateHbbtvSetAudioStreamCommand(b, a), this.sendHbbtvCommand("setaudiostream", b)
    }, p.prototype.populateHbbtvSetAudioStreamCommand = function(a, b) {
        var c = "ad" == b ? "audioDescription" : "main";
        a.audiostream = c
    }, p.prototype.sendHbbtvSetSubtitlesCommand = function(a) {
        var b = {};
        this.populateHbbtvSetSubtitlesCommand(b, a), this.sendHbbtvCommand("setsubtitles", b)
    }, p.prototype.populateHbbtvSetSubtitlesCommand = function(a, b) {
        var c = void 0 == b ? -1 : 0;
        a.subtitles = c
    }, p.prototype.pairHbbTvDevice = function(a) {
        void 0 != this.hbbtv && (a = a.replace(/ /g, ""), k.debug("Pairing", a), this.hbbtv.pairDevice(a))
    }, p.prototype.hbbtvOnPairDeviceResult = function(a) {
        k.info("HBBTV pair device result", a), "ok" == a.result && (m.deactivateSettingsInnerPage(), m.closeSettings(), this.updateAvailTVs())
    }, p.prototype.computeHbbtvPosition = function() {
        var a = parseFloat(this.lastKnownHbbtvPosition),
            b = ((new Date).getTime() - this.lastHbbtvTimestamp) / 1e3;
        return "LIVE" == this.lastKnownHbbtvVideoType ? this.lastKnownHbbtvPlaying || (a -= b) : this.lastKnownHbbtvPlaying && (a += b), a
    }, p.prototype.storeHbbtvPosition = function(a, b) {
        void 0 == a && (a = this.computeHbbtvPosition()), this.lastKnownHbbtvPosition = a, void 0 != b && (this.lastKnownHbbtvPlaying = b), this.lastHbbtvTimestamp = (new Date).getTime()
    }, p.prototype.playerInserted = function() {
        k.info("player inserted start"), j.video = $(j.mainShellId + " #video")[0], j.playerStatus = "initialized", j.isPC = 1 != j.settings.mobilePlayer, j.settings.autoPlay && j.isPC ? j.autoPlayDisplayed = !1 : ($(j.mainShellId + " .playerMainShell").addClass("autoPlay"), j.autoPlayDisplayed = !0, k.info("autoPlay displayed")), k.debug("video: ", j.video), l = new a, m = new c, m.isSeekBarActive = !1, o = "DASH" == j.settings.streamingProtocol ? new v(j.video) : new w(j.video), o.init(), n = new r, j.settings.playlist && n.init(j.settings.playlist);
        var b = parseInt(j.getCookie("volume"));
        if (isNaN(b) ? k.info("not setting volume from cookies", b) : (k.info("setting volume from cookies", b), j.setVolume(b, !0, !0)), $(window).resize(function() {
                m.roundShellPadding(), m.setContainerSize(), m.format()
            }), window.setInterval(function() {
                m.roundShellPadding(), m.checkResize(), j.checkDeeplinking(), j.sendCurrentGemiusState(), j.video.readyState > 2 && j.longBufferingErrorScreenTimerHolder.cancel()
            }, 200), m.roundShellPadding(), m.setContainerSize(), m.format(), m.addOrRemoveClass($(j.mainShellId + " .playerMainShell"), j.settings.hbbtvDisable, "hbbtvDisabled"), $(j.mainShellId + " #videoShell").on("webkitfullscreenchange mozfullscreenchange MSFullscreenChange fullscreenchange", function(a) {
                j.onFullScreenToggle()
            }), $(document).on("webkitfullscreenchange mozfullscreenchange MSFullscreenChange fullscreenchange", function(a) {
                j.onFullScreenToggle()
            }), $(j.mainShellId + " #videoShell").on("webkitbeginfullscreen", function(a) {
                j.onFullScreenOn()
            }), $(j.mainShellId + " #videoShell").on("webkitendfullscreen", function(a) {
                j.onFullScreenOff()
            }), j.settings.useNativeVideoPlayer) {
            $(j.mainShellId + " .playerMainShell").addClass("nativeVideo");
            $(j.mainShellId + " #video").on("webkitendfullscreen", function(a) {
                k.debug("native video player exited, playsInline supported:", "playsInline" in j.video), j.pause(!1, !1, !0), l.showControls()
            })
        }
        j.on_start()
    }, p.prototype.on_start = function() {
        if (k.info("Onstart: settings", j.settings), (j.settings.mute || "true" == j.settings.mute) && j.setVolume(0, !0, !0), j.settings.allControlsHidden && $(j.mainShellId + " .playerMainShell").addClass("allControlsHidden"), void 0 != j.settings.hideControlsDelayNormal && (j.hideControlsDelay = parseInt(j.settings.hideControlsDelayNormal)), k.debug("hide controls delay set to " + j.hideControlsDelay), 0 == j.settings.controlsHideable && $(j.mainShellId + " .playerMainShell").addClass("controlsNotHideable"), void 0 !== j.settings.playlistURL && "" != j.settings.playlistURL) j.loadPlaylistUrl(j.settings.playlistURL, function(a) {
            n.init(a), j.on_playlist_loaded()
        });
        else {
            if (void 0 === j.settings.playlist) return k.error("ERROR: no playlist"), k.error("playlistURL: ", j.settings.playlistURL), k.error("settings: ", j.settings), void j.showErrorScreen(!1, "noPlaylist");
            j.on_playlist_loaded()
        }(j.settings.editMode || "true" == j.settings.editMode) && (j.editMode = !0, l.showEditModeShell()), j.settings.skinVolumeActive && l.setSkinVolumeActive(j.settings.skinVolumeActive), j.settings.indexLineColor ? l.setIndexLineColor(j.settings.indexLineColor) : l.setIndexLineColor("#f0f300"), l.useCustomPlayIcon(j.settings.iconPlayPictureURL), l.useCustomPauseIcon(j.settings.iconPausePictureURL), l.useCustomReplayIcon(j.settings.iconReplayPictureURL), l.setHbbtvPreviewImage(j.settings.hbbtvControlPreviewImageUrl, j.settings.hbbtvControlDefaultPreviewImage), setInterval(function() {
            j.isLoading || j.saveCurrentPosition()
        }, 5e3), j.startTimeTick(), j.performLiveTsChanger = !1
    }, p.prototype.logEvent = function(a, b) {
        j.logEventGA(a, b), k.info("Log", a, b)
    }, p.prototype.logEventGA = function(a, b) {
        if ("" != this.settings.gaTrackingId) {
            var c;
            c = void 0 != this.settings.gaPrefix && "" != this.settings.gaPrefix ? this.settings.gaPrefix : "html", ga("player.send", "event", c + "-" + a, b, this.isPC ? "desktop" : "mobile")
        }
    }, p.prototype.initializeGemius = function() {
        if (this.initializeGemiusCalledForCurrentItem) return this.gemiusOpen;
        if (this.gemiusOpen = !1, this.initializeGemiusCalledForCurrentItem = !0, this.lastGemiusEventType = void 0, "undefined" == typeof gemiusStream || "function" != typeof gemiusStream.newStream) return k.error("Gemius library not available"), !1;
        if (void 0 == this.currentItem) return k.info("No current item, will not initialize gemius"), !1;
        var a = n.getGemius();
        if (void 0 == a) return k.info("No gemius section in playlist"), !1;
        var b = this.currentItem.getGemiusParams();
        if (void 0 == b) return k.info("No gemius section in the current playlist item"), !1;
        this.gemiusMaterialIdentifier = b.ID;
        var c;
        c = j.isLive() ? -1 : this.currentItem.getRealDuration();
        var d = [];
        for (var e in b)
            if (b.hasOwnProperty(e) && "ID" != e) {
                var f = b[e];
                void 0 != f && "" != f && d.push({
                    name: e,
                    value: f
                })
            }
        k.info("Opening Gemius stream", this.gemiusPlayerId, this.gemiusMaterialIdentifier, c, d, [], a.IDENTIFIER, a.HITCOLLECTOR, []);
        try {
            gemiusStream.newStream(this.gemiusPlayerId, this.gemiusMaterialIdentifier, c, d, [], a.IDENTIFIER, a.HITCOLLECTOR, [])
        } catch (a) {
            return k.error("Error opening Gemius stream", a), !1
        }
        return this.gemiusOpen = !0, this.gemiusCompleted = !1, !0
    }, p.prototype.gemiusStreamEnded = function() {
        if (this.initializeGemiusCalledForCurrentItem = !1, this.gemiusOpen) {
            if (!this.gemiusCompleted) {
                k.info("Closing Gemius stream", this.gemiusPlayerId, this.gemiusMaterialIdentifier, this.getGemiusMovieTime());
                try {
                    gemiusStream.closeStream(this.gemiusPlayerId, this.gemiusMaterialIdentifier, this.getGemiusMovieTime())
                } catch (a) {
                    k.error("Error closing Gemius stream", a)
                }
            }
            this.gemiusOpen = !1
        }
    }, p.prototype.sendGemiusEvent = function(a) {
        if (this.initializeGemius()) {
            k.info("Sending Gemius event", this.gemiusPlayerId, this.gemiusMaterialIdentifier, this.getGemiusMovieTime(), a);
            try {
                gemiusStream.event(this.gemiusPlayerId, this.gemiusMaterialIdentifier, this.getGemiusMovieTime(), a)
            } catch (a) {
                k.error("Error sending Gemius event", a)
            }
            "complete" == a && (this.gemiusCompleted = !0), this.lastGemiusEventType = a
        }
    }, p.prototype.sendCurrentGemiusState = function() {
        if (this.video.readyState >= 3)
            if (this.video.paused) switch (this.lastGemiusEventType) {
                case void 0:
                case "playing":
                case "buffering":
                case "seekingStarted":
                    this.sendGemiusEvent("paused")
            } else switch (this.lastGemiusEventType) {
                case void 0:
                case "paused":
                case "stopped":
                case "buffering":
                case "seekingStarted":
                    this.sendGemiusEvent("playing")
            } else switch (this.lastGemiusEventType) {
                case void 0:
                case "playing":
                case "paused":
                case "seekingStarted":
                    this.sendGemiusEvent("buffering")
            }
    }, p.prototype.loadPlaylistUrl = function(a, b, c) {
        void 0 !== a && (this.loadingPlaylist = !0, $.ajax({
            url: a,
            context: this,
            beforeSend: function() {}
        }).done(function(d) {
            k.info("playlist loaded", d), this.loadingPlaylist = !1;
            var e;
            try {
                e = "string" == typeof d ? JSON.parse(d) : d
            } catch (b) {
                return k.error("error parsing playlist from ", a), k.error("Catch error", b), j.showErrorScreen(!1, "invalidPlaylist"), void(void 0 != c && c.call(j))
            }
            jQuery.extend(!0, j.settings, e.setup), k.info("loadPlaylist success:", e), b.call(j, e), this.startPendingPlaylistLoad()
        }).fail(function() {
            k.error("loading playlist from url: '", a, "' failed"), this.loadingPlaylist = !1, j.showErrorScreen(!1, "playlistNotFound"), void 0 != c && c.call(j), this.startPendingPlaylistLoad()
        }))
    }, p.prototype.loadPlaylistWhenReady = function(a) {
        this.pendingPlaylistUrl = a, this.startPendingPlaylistLoad()
    }, p.prototype.startPendingPlaylistLoad = function() {
        if (!this.loadingPlaylist && !this.waitingForStream && void 0 != this.pendingPlaylistUrl) {
            k.info("Start pending playlist load", this.loadingPlaylist, this.waitingForStream, this.endingPlaylistUrl), this.pause(!0), this.showLoadingScreen();
            var a = this.pendingPlaylistUrl;
            this.pendingPlaylistUrl = void 0, this.loadPlaylistUrl(a, function(a) {
                k.info("loaded pending playlist"), n.init(a), j.on_playlist_loaded()
            })
        }
    }, p.prototype.on_playlist_loaded = function() {
        if (k.info("playlist LOADED"), this.currentItemIndex = void 0, this.currentItem = void 0, j.playerStatus = "loaded", k.info("getting first item"), m.showReplayPoster(), j.isTimeshift = !1, j.invokeCallbackFunction("playlistLoaded", jQuery.extend(!0, {}, n.ct_playlist)), j.isThisNewWindow) {
            j.positionCookieKey = j.newWindowData.positionCookieKey, j.positionCookie = j.newWindowData.positionCookie, j.invokePlayCallbackOnStreamLoaded = !1;
            var a = j.newWindowData.playlistItemIndex;
            void 0 != a ? j.play_item(a, j.newWindowData.useTimeshift, j.newWindowData.shouldPauseNewWindow, j.newWindowData.startTime) : j.play_item(0, !1, j.autoPlayDisplayed)
        } else {
            var b = j.getCookie("audioTrack");
            j.currentAudioTrack = b, j.computePositionCookieKey(), j.allocatePositionCookie(), j.invokePlayCallbackOnStreamLoaded = !0, j.attemptCookiePositioning(0, j.autoPlayDisplayed) || j.play_item(0, !1, j.autoPlayDisplayed)
        }
    }, p.prototype.attemptCookiePositioning = function(a, b) {
        if (0 != this.getItemCanonicalIndex(a)) return k.info("Not at first regular item, cookie positioning skipped"), !1;
        var c = this.getCookie(this.positionCookie);
        if ("" == c) return k.info("No position cookie stored"), !1;
        var d = this.parsePositionCookie(c);
        return d.item >= n.getMainPlaylistItemCount() ? (k.info("Cookie item " + d.item + " does not exist"), !1) : n.getPlaylistItem(d.item).isLive() ? (k.info("Ignoring position cookie - item #" + d.item + " is LIVE"), !1) : (k.info("Position from cookie: item=" + d.item + " time=" + d.time + ", paused=" + b), this.throwAwayDeeplinkingTarget(), this.play_item(n.getPrerollItemCount() + d.item, !1, b, d.time), !0)
    }, p.prototype.showScreen = function(a) {
        var b = $(j.mainShellId + " .playerMainShell");
        ["loading", "video", "error", "nextInSeries"].forEach(function(c) {
            var d = c + "MainScreenActive";
            c == a ? b.addClass(d) : b.removeClass(d)
        }), this.currentScreenName = a, "error" != a && (this.errorScreenDisplayed = !1, this.errorCallbackInvoked && (window[j.settings.errorCallbackStatus].call(this), this.errorCallbackInvoked = !1)), this.cancelScheduledVideoErrorScreen()
    }, p.prototype.showLoadingScreen = function() {
        j.showScreen("loading"), j.isLoading = !0
    }, p.prototype.showVideoScreen = function() {
        j.showScreen("video"), j.isLoading = !1
    }, p.prototype.scheduleVideoErrorScreen = function(a) {
        this.videoErrorScreenTimerHolder.isScheduled() ? k.info("Error screen already scheduled") : this.videoErrorScreenTimerHolder.setTimeout(a, this, Array.prototype.slice.call(arguments, 1))
    }, p.prototype.cancelScheduledVideoErrorScreen = function() {
        this.videoErrorScreenTimerHolder.cancel()
    }, p.prototype.showErrorScreen = function(a, b, c, d, e) {
        if (void 0 != j.currentItem && j.currentItem.isVast) return k.info("no error screen for VAST"), void j.playNextItem();
        if (this.errorScreenDisplayed) return void k.info("error screen already displayed");
        this.errorScreenDisplayed = !0;
        var f;
        void 0 != j.settings.errorCallbackStatus ? (f = window[j.settings.errorCallbackStatus].call(this, b, c, d, e), j.errorCallbackInvoked = !0) : f = !0, $(j.mainShellId + " #errorDetail").text(b + " " + c + " " + d + " " + e), f && j.showScreen("error"), k.error("Error occured - Error sceen displayed", a, b, c, d, e), a && j.logEvent("errors", "video_load")
    }, p.prototype.play_item = function(a, b, c, d) {
        k.info("play_item", a, b, c, d), j.gemiusStreamEnded();
        var e = n.getItem(a);
        if (e) {
            j.videoStartTime = d;
            var f, g;
            b ? (g = "timeshift", "ad" == j.currentAudioTrack && (f = "audioDescriptionTimeshift")) : (g = "main", "ad" == j.currentAudioTrack && (f = "audioDescription")), null != f && (k.info("Checking adStreamId ", f, ": ", e.hasStreamId(f)), e.hasStreamId(f) ? g = f : j.currentAudioTrack = "cs"), j.currentItemIndex = a, j.currentItem = e, j.isTimeshift = b, m.setContainerSize(), m.transformVideo(j.settings.offsetX, j.settings.offsetY), k.info("play_item pause requested: ", c);
            var h;
            h = void 0 == c ? "playing" == j.playerStatus : !c, j.setAutoPlay(h), j.waitingForStream = !0, e.loadAndPlay(j.settings.streamingProtocol, g, d)
        } else k.error("play_item error: itemIndex==", a, " playlist_item is " + e)
    }, p.prototype.onStreamLoaded = function() {
        k.info("Stream loaded"), j.waitingForStream = !1, j.streamLoadedTimestamp = (new Date).getTime(), void 0 !== j.videoStartTime ? (k.info("Setting time", j.videoStartTime), j.video.currentTime = j.videoStartTime, delete j.videoStartTime) : k.debug("videoStartTime is undefined"), "playing" == j.playerStatus && j.invokePlayCallbackOnStreamLoaded && (j.invokeCallbackFunction("play"), j.invokePlayCallbackOnStreamLoaded = !1), j.invokeCallbackFunction(j.isTimeshift ? "toTimeshift" : "toLive"), k.info("Current audiotrack is: ", j.currentAudioTrack);
        var a;
        j.getAudioTracks().forEach(function(b, c) {
            b.value == j.currentAudioTrack && (a = c)
        }, j), void 0 == a && void 0 != j.getAudioTracks()[0] && (j.currentAudioTrack = j.getAudioTracks()[0].value, j.saveCookiesAudiotrack(), k.info("Unsupported audiotrack, switched to", j.currentAudioTrack), a = 0), void 0 != a && j.selectAudioTrack(j.currentAudioTrack), void 0 !== j.currentItem.getSkipDelay() ? l.setupSkipOverlay(parseInt(j.currentItem.getSkipDelay())) : l.hideSkipOverlay(), j.currentItem.isVast && j.logEvent("ad", "show"), j.showVideoScreen(), j.isTimeshift && l.updateSeekBar(j.getStreamRange().max);
        var b = j.getCookie("subtitles");
        j.settings.useNativeVideoPlayer ? void 0 != b && "" != b && j.selectSubtitles(b, !0, !0) : j.selectSubtitles(b, !0, !0) || j.selectSubtitles(void 0, !0, !0);
        var c = j.getCookie("videoQuality");
        k.info("Quality loaded from cookies", c), j.setQuality(c) || j.setQuality("auto"), j.updateAutoQualityInfo(), m.setupForLoadedSource(), j.performLiveTsChanger && setTimeout(function() {
            j.switchTimeshift(!j.isTimeshift)
        }, 1e3 * j.liveTsChangerDelay), j.storeTimeshiftPauseMarker(), j.initializeGemius(), j.startPendingPlaylistLoad()
    }, p.prototype.onVideoPlayEvent = function() {
        "paused" == this.playerStatus && (k.debug("spurious play event"), this.play()), this.removeAutoPlay(), k.debug("playing " + t.currentTime), this.sendGemiusEvent("playing")
    }, p.prototype.removeAutoPlay = function() {
        $(j.mainShellId + " .playerMainShell").removeClass("autoPlay"), j.autoPlayDisplayed = !1
    }, p.prototype.onVideoPausedEvent = function() {
        this.sendGemiusEvent("paused"), this.settings.useNativeVideoPlayer && (this.video.webkitExitFullscreen ? this.video.webkitExitFullscreen() : k.warn("native player does not support webkitExitFullscreen"))
    }, p.prototype.onVideoWaitingEvent = function() {
        this.sendGemiusEvent("buffering"), this.settings.mobilePlayer && (this.longBufferingErrorScreenTimerHolder.isScheduled() ? k.info("Long buffering error screen already scheduled") : this.longBufferingErrorScreenTimerHolder.setTimeout(15e3, this, [!0, "longBuffering"]))
    }, p.prototype.onVideoSeekingEvent = function() {
        this.sendGemiusEvent("seekingStarted")
    }, p.prototype.play = function(a, b) {
        if ("playing" != j.playerStatus) {
            var c = this.isHbbTvActive();
            if (a || (j.invokeCallbackFunction("play"), j.logEvent("action", "play"), j.currentItem && j.currentItem.onResume()), j.removeAutoPlay(), l.activateCentralButton("pause"), j.playerStatus = "playing", m.formatClickThrough(), c) b || this.sendHbbtvCommand("play");
            else {
                if ("paused" == j.playerStatus && j.isLive() && !j.isTimeshift) {
                    var d = j.getTimeInPause();
                    if (d < 1e3 * j.timeShiftOffset && d > 1e3) return void j.switchTimeshift(!1, !1)
                }
                j.afterTS && j.switchTimeshift(!1, !1), o.play()
            }
        }
    }, p.prototype.stop = function(a, b) {
        var c = this.isHbbTvActive();
        a || (j.invokeCallbackFunction("stop"), j.logEvent("action", "stop")), j.pause(!0), c ? (this.storeHbbtvPosition(void 0, !1), b || this.sendHbbtvCommand("stop")) : void 0 != j.currentItem && (j.isLive() ? (j.isTimeshift && j.seekTo(j.getStreamRange().min), j.setAfterTS()) : j.seekTo(j.getStreamRange().min))
    }, p.prototype.pause = function(a, b, c) {
        if ("paused" != j.playerStatus) {
            var d = this.isHbbTvActive();
            a || (j.logEvent("action", "pause"), j.invokeCallbackFunction("pause")), l.activateCentralButton("play"), j.pauseTimestamp = (new Date).getTime(), j.playerStatus = "paused", m.formatClickThrough(), j.storeTimeshiftPauseMarker(), d ? (this.storeHbbtvPosition(void 0, !1), b || this.sendHbbtvCommand("pause")) : c || o.pause()
        }
    }, p.prototype.replay = function() {
        k.info("replay"), l.activateCentralButton("pause"), m.activateReplayScreen(!1), j.invokePlayCallbackOnStreamLoaded = !0, j.play_item(0, !1, !1)
    }, p.prototype.setVolume = function(a, b, c) {
        var d = a != 100 * j.video.volume;
        b || (j.isMuted() && d && a > 0 ? (j.logEvent("sound", "on"), j.currentItem && j.currentItem.onUnmute()) : !j.isMuted() && d && 0 == a && (j.logEvent("sound", "off"), j.currentItem && j.currentItem.onMute()), j.invokeCallbackFunction("changevolume", a)), j.video.volume = a / 100, l.updateVolumeBar(), c || j.saveCookiesVolume(), 0 != a && (j.volumeBeforeMute = a)
    }, p.prototype.getVolume = function() {
        return 100 * j.video.volume
    }, p.prototype.switchMute = function() {
        j.isMuted() ? j.setVolume(j.volumeBeforeMute) : j.setVolume(0)
    }, p.prototype.isMuted = function() {
        return 0 == j.video.volume
    }, p.prototype.toggleFullScreen = function(a, b) {
        (void 0 == a || j.isFullScreen) && (j.isFullScreen ? (b || (j.invokeCallbackFunction("fromfullscreen"), j.currentItem && j.currentItem.onExitFullscreen()), j.toggleFullScreenOff()) : (j.toggleFullScreenOn(), b || (j.invokeCallbackFunction("tofullscreen"), j.currentItem && j.currentItem.onFullscreen())))
    }, p.prototype.toggleFullScreenOff = function() {
        document.exitFullscreen ? (document.exitFullscreen(), k.debug("exitFullscreen (1)")) : document.mozCancelFullScreen ? (document.mozCancelFullScreen(), k.debug("mozCancelFullScreen (2)")) : document.webkitCancelFullScreen ? (document.webkitCancelFullScreen(), k.debug("webkitCancelFullScreen (3)")) : document.cancelFullScreen ? (document.cancelFullScreen(), k.debug("cancelFullScreen (4)")) : document.msExitFullscreen ? (document.msExitFullscreen(), k.debug("msExitFullscreen (5)")) : (k.debug("Remove pseudo FullScreen class"), $("body").removeClass("iOSfullscreen"), this.fakeFullscreen = !1, this.sendFullScreenMessageToParentFrame(!1), j.onFullScreenOff())
    }, p.prototype.toggleFullScreenOn = function() {
        var a = $(j.mainShellId + " #videoShell"),
            b = a[0];
        if (this.fullScreenContainer = a, this.settings.useNativeVideoPlayer && this.video.webkitEnterFullscreen) this.video.webkitEnterFullscreen(), k.debug("video.webkitEnterFullscreen (0)");
        else if (b.requestFullscreen) b.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT), k.debug("requestFullscreen (1)");
        else if (b.mozRequestFullScreen) b.mozRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT), k.debug("mozRequestFullScreen (2)");
        else if (b.webkitRequestFullScreen) b.webkitRequestFullScreen(), k.debug("webkitRequestFullScreen (3)");
        else if (b.requestFullScreen) b.requestFullScreen(Element.ALLOW_KEYBOARD_INPUT), k.debug("requestFullScreen (4)");
        else if (b.msRequestFullscreen) b.msRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT), k.debug("msRequestFullscreen (5)");
        else if (b.webkitRequestFullscreen) b.webkitRequestFullscreen(), k.debug("webkitRequestFullscreen (6)");
        else {
            k.debug("No working FullScreen command, try pseudoFS"), this.fakeFullscreen = !0;
            var c = $("body");
            this.fullScreenContainer = c, c.addClass("iOSfullscreen"), this.sendFullScreenMessageToParentFrame(!0), j.onFullScreenOn()
        }
    }, p.prototype.sendFullScreenMessageToParentFrame = function(a) {
        window.frameElement && window.parent.postMessage(["fullScreen", a], "*")
    }, p.prototype.onFullScreenToggle = function() {
        document.fullscreenElement || document.webkitCurrentFullScreenElement ? j.onFullScreenOn() : j.onFullScreenOff()
    }, p.prototype.onFullScreenOn = function() {
        j.isFullScreen = !0, m.roundShellPadding(!0), m.setContainerSize(), m.setFullScreenButtonIcon(!0), j.logEvent("resize", "toFullscreen"), l.updateSeekBar(), m.format(), l.focusPlayer()
    }, p.prototype.onFullScreenOff = function() {
        j.isFullScreen = !1, m.roundShellPadding(!0), m.setContainerSize(), m.setFullScreenButtonIcon(!1), j.logEvent("resize", "fromFullscreen"), l.updateSeekBar(), m.format(), l.focusPlayer(), $(j.mainShellId + " .playerMainShell").blur(), l.focusPlayer()
    }, p.prototype.setAutoPlay = function(a) {
        k.debug("PlayerMgr.setAutoPlay", a), l.activateCentralButton(a ? "pause" : "play"), j.playerStatus = a ? "playing" : "paused", o.setAutoPlay(a)
    }, p.prototype.switchTimeshift = function(a, b, c, d) {
        var e = this.isHbbTvActive();
        if (j.unsetAfterTS(), j.isTimeshift = a, a ? (j.logEvent("timeshift", "toTimeshift"), m.forceSeekBarRepaint = !0) : j.logEvent("timeshift", "toLive"), k.debug("switchTimeshift pause requested:", b), e) {
            var f;
            a ? void 0 == (f = c) && (f = 0 - this.timeShiftOffset) : f = 0, this.storeHbbtvPosition(f, void 0), d || (a ? this.sendHbbtvSeek(f) : this.sendHbbtvCommand("live"))
        } else j.play_item(j.currentItemIndex, a, b, c);
        m.format()
    }, p.prototype.updateAutoQualityInfo = function() {
        if (void 0 == this.selectedTvId) {
            if ("auto" != this.currentQuality) {
                var a = j.settings.maxBitrate || 9999,
                    b = this.getSpeedResolution(1e3 * a);
                return void m.updateAutoQualityText(b)
            }
            var c = o.getCurrentBandwidth();
            if (void 0 != c) {
                var d = this.getSpeedResolution(c);
                m.updateAutoQualityText(d), void 0 != this.lastAdaptiveQualityResolution && this.lastAdaptiveQualityResolution != d && this.invokeCallbackFunction("switchlevel", this.lastAdaptiveQualityResolution, d), this.lastAdaptiveQualityResolution = d
            }
        }
    }, p.prototype.setQuality = function(a, b) {
        var c = this,
            d = this.isHbbTvActive(),
            e = !1;
        return j.getQualityInfo().forEach(function(f) {
            if (f.key == a) {
                if (k.info("setting quality ", f.id), d) {
                    if (!b) {
                        var g = ["288p", "404p", "576p", "720p"];
                        if (g.indexOf(a) < 0) k.warn("Quality", a, "not supported by HBBTv");
                        else {
                            var h = "max" + a;
                            c.sendHbbtvCommand("setquality", {
                                quality: h
                            })
                        }
                    }
                } else o.setQuality(f.id, j.settings.maxBitrate);
                e = !0
            }
        }), e && (j.currentQuality = a, m.formatQualitySelector(), d || j.saveCookiesVideoquality(), j.lastAdaptiveQualityResolution = void 0, j.updateAutoQualityInfo()), e
    }, p.prototype.manualSetQuality = function(a) {
        var b = j.currentQuality;
        this.setQuality(a), this.invokeCallbackFunction("manualswitchlevel", b, j.currentQuality), this.logEvent("action", "auto" == a ? "Auto" : a)
    }, p.prototype.onStreamEnd = function() {
        k.info("stream end"), j.sendGemiusEvent("complete"), j.currentItem && j.currentItem.onEnded(), j.currentItem && j.currentItem.isVoD() && j.deletePositionCookie(), j.loadingPlaylist || j.playNextItem()
    }, p.prototype.onSkip = function(a) {
        var b = this.isHbbTvActive();
        k.info("stream skipped"), j.currentItem && j.currentItem.onSkip(), l.hideSkipOverlay(), j.logEvent("ad", "hide"), b ? a || this.sendHbbtvCommand("skipad") : j.playNextItem()
    }, p.prototype.playNextItem = function() {
        var a = n.getItemCount(),
            b = j.currentItemIndex + 1;
        if (k.info("play next item - ", b, " of ", a), b < a) k.info("play next item 1"), j.invokeCallbackFunction("next"), j.logEvent("action", "next"), j.invokePlayCallbackOnStreamLoaded = !1, j.attemptCookiePositioning(b, j.autoPlayDisplayed) || j.play_item(b, !1, j.autoPlayDisplayed);
        else if ("string" != typeof j.settings.loop && j.settings.loop || "true" == j.settings.loop) k.info("play next item 2"), j.invokeCallbackFunction("next"), j.logEvent("action", "next"), j.invokePlayCallbackOnStreamLoaded = !1, j.play_item(0, !1, !1);
        else if (j.isFullScreen && void 0 !== n.ct_playlist.setup.nextPlaylist && 0 != j.settings.nextPlayListAutoplay && !j.settings.editMode) {
            k.info("play next item 3", j.settings.nextPlayListAutoplay), j.invokeCallbackFunction("next"), j.logEvent("action", "next"), j.playerStatus = "ended";
            var c = window.setTimeout(function() {
                j.showLoadingScreen()
            }, 500);
            o.pause(), j.invokePlayCallbackOnStreamLoaded = !1;
            var d;
            d = void 0 == j.settings.loadNextPlaylistDelay ? 10 : parseInt(j.settings.loadNextPlaylistDelay);
            var e = n.getPlaylistItem(0).getTitle();
            j.isLoading = !1, this.loadPlaylistUrl(n.ct_playlist.setup.nextPlaylist, function(a) {
                window.clearTimeout(c), l.setupNextInSeries(d, e, a), j.showScreen("nextInSeries")
            }, function() {
                k.error("next playlist load failed"), window.clearTimeout(c)
            })
        } else j.onPlaylistEnd()
    }, p.prototype.onPlaylistEnd = function() {
        j.showVideoScreen(), j.invokeCallbackFunction("ended"), k.info("no more items to play; box should appear"), l.activateCentralButton("replay"), m.activateReplayScreen(!0), j.playerStatus = "ended", o.pause()
    }, p.prototype.playNextInSeries = function(a) {
        k.info("play next in series NOW"), n.init(a), j.on_playlist_loaded()
    }, p.prototype.playPreviousItem = function() {
        k.info("play privous item"), j.logEvent("action", "previous"), j.currentItemIndex > n.getPrerollItemCount() ? j.play_item(j.currentItemIndex - 1, !1, !1) : j.play_item(j.currentItemIndex, !1, !1)
    }, p.prototype.invokeCallbackFunction = function(a) {
        var b;
        switch (a) {
            case "playlistLoaded":
            case "toLive":
            case "toTimeshift":
                b = !0;
                break;
            default:
                b = !1
        }
        if (b && !j.settings.extendedCallbacks) return void k.debug("filtered extended callback", a);
        var c = this.settings.callbackStatus;
        if (void 0 != c) {
            var d, e;
            if (void 0 != j.currentItem) {
                if (void 0 != this.selectedTvId) d = this.computeHbbtvPosition(), e = this.lastKnownHbbtvDuration;
                else {
                    d = this.getStreamPosition();
                    var f = this.getStreamRange();
                    e = f.max - f.min
                }
                j.isLive() && (d = void 0, j.isTimeshift || (e = void 0))
            }
            var g = [a];
            "ended" != a && g.push(d), g.push(e), g = g.concat(Array.prototype.slice.call(arguments).slice(1)), j.isLive() && "seeking" == a && (g[3] = void 0);
            for (var h = 0; h < g.length; h++) void 0 == g[h] && (g[h] = null);
            try {
                window[c].apply(null, g)
            } catch (b) {
                k.error("ERROR in callback (" + c + ") for " + a + ": " + b.message)
            }
        } else k.info("CALLBACK " + a + " not called, since callback method isn't specified")
    }, p.prototype.getVideoDuration = function() {
        return o.getVideoDuration()
    }, p.prototype.getLanguageCode = function(a) {
        for (var b = j.settings.languages.languages || [], c = 0; c < b.length; c++)
            if (b[c].name == a) return b[c].code;
        return "st"
    }, p.prototype.getLanguageName = function(a) {
        for (var b = j.settings.languages.languages || [], c = 0; c < b.length; c++)
            if (b[c].code == a) return b[c].name
    }, p.prototype.getAvailTVsInfo = function() {
        return this.availTVsInfo
    }, p.prototype.getSubtitlesInfo = function() {
        if (this.isHbbTvActive()) return this.lastKnownHbbtvSubtitles;
        var a = [];
        if (void 0 != this.currentItem) {
            var c = this;
            this.currentItem.getSubtitlesInfo().forEach(function(b, d) {
                a.push({
                    value: d,
                    text: b.title,
                    language: c.getLanguageCode(b.title)
                })
            })
        }
        return a
    }, p.prototype.selectSubtitles = function(a, b, c, d) {
        var e = this.isHbbTvActive(),
            f = void 0;
        if (void 0 != a && (j.getSubtitlesInfo().forEach(function(b, c) {
                b.language == a && (f = c)
            }), void 0 == f)) return k.info("subtitles not found: ", a), !1;
        var g = j.selectedSubtitles;
        return j.selectedSubtitles = a, e ? d || this.sendHbbtvSetSubtitlesCommand(a) : j.settings.useNativeVideoPlayer ? $($(j.video).prop("textTracks")).prop("mode", function() {
            return k.info("setting native textTrack mode for", this.language), this.language == a ? "showing" : "hidden"
        }) : l.setSubtitlesTrack(f), m.formatSubtitlesSelector(), c || j.saveCookiesSubtitles(), b || (j.invokeCallbackFunction("subtitletrackchange", g, a), j.logEvent("subtitles", void 0 == a ? "off" : "on")), !0
    }, p.prototype.getAudioTracks = function() {
        if (this.isHbbTvActive()) return this.lastKnownHbbtvAudioTracks;
        var a = [];
        return o.getAudioTracks().forEach(function(b) {
            a.push({
                value: b,
                text: j.getLanguageName(b),
                language: b
            })
        }), void 0 != j.currentItem && j.currentItem.hasAudioDescription() && a.push({
            value: "ad",
            text: j.getLanguageName("ad"),
            language: "ad"
        }), a
    }, p.prototype.setAudioTrack = function(a, b, c) {
        var d = this.isHbbTvActive();
        k.info("set audio track", a);
        var e = j.currentAudioTrack;
        if (j.currentAudioTrack = a, j.saveCookiesAudiotrack(), b || j.invokeCallbackFunction("audiotrackchange", e, a), m.formatAudioSelector(), d) c || this.sendHbbtvSetAudioStreamCommand(a);
        else {
            var f;
            if ("ad" == e) {
                if ("ad" == a) return;
                f = !0
            } else f = "ad" == a;
            f ? j.play_item(j.currentItemIndex, j.isTimeshift, void 0, j.video.currentTime) : j.selectAudioTrack(a)
        }
    }, p.prototype.selectAudioTrack = function(a) {
        o.selectAudioTrack(a)
    }, p.prototype.getVideoTracks = function() {
        return o.getVideoTracks()
    }, p.prototype.getQualityInfo = function() {
        if (this.isHbbTvActive()) return this.lastKnownHbbtvQualities;
        var a = [{
                key: "auto",
                id: "auto"
            }],
            b = j.getVideoTracks();
        return void 0 != b && b.forEach(function(b) {
            var c = j.getSpeedResolution(b.bandwidth);
            a.push({
                key: c,
                id: b.id,
                bandwidth: b.bandwidth,
                resolution: c
            })
        }), a
    }, p.prototype.getSpeedResolution = function(a) {
        var b = j.settings.speedResolution.speedResolution,
            c = void 0,
            d = void 0;
        return b.forEach(function(b) {
            var e = 1e3 * b.speed,
                f = Math.abs(e - a);
            (void 0 == c || c > f) && (c = f, d = b.resolution)
        }), d
    }, p.prototype.getQualityResolutionText = function(a) {
        for (var b = j.settings.qualityResolutionText.qualityResolutionText || [], c = 0; c < b.length; c++) {
            var d = b[c];
            if (d.resolution == a) return d.text
        }
        return a
    }, p.prototype.findIndexTime = function(a, b) {
        for (var c, d = j.currentItem.getIndexes(), e = 0; e < d.length; e++) {
            var f = d[e];
            if (!(f.time < a)) return b ? f.time : c > 0 ? d[c - 1].time : d[c].time;
            c = e
        }
        return c > 0 ? d[c - 1].time : d[c].time
    }, p.prototype.jumpToIndex = function(a) {
        var b = j.video.currentTime,
            c = j.findIndexTime(b, a);
        j.video.currentTime = c, l.updateSeekBar(c)
    }, p.prototype.manualSeek = function(a) {
        a != j.video.currentTime && (j.invokeCallbackFunction("seeking", a), j.logEvent("action", "seeking"), j.seekTo(a))
    }, p.prototype.seekToIndex = function(a) {
        j.invokeCallbackFunction("index", a), j.logEvent("action", "index"), j.seekTo(a)
    }, p.prototype.seekTo = function(a, b) {
        var c = this.isHbbTvActive();
        l.updateSeekBar(a), j.afterTS ? c || j.switchTimeshift(!0, !0, a) : (c || (o.isHLS && this.isTimeshift && (a += ((new Date).getTime() - this.streamLoadedTimestamp) / 1e3), k.info("Seeking to:", a), j.video.currentTime = a), j.storeTimeshiftPauseMarker(), j.saveCurrentPosition()), c && (b ? this.storeHbbtvPosition(a, void 0) : this.sendHbbtvSeek(a))
    }, p.prototype.seekBy = function(a) {
        this.currentItem && !this.currentItem.isVast && (this.afterTS ? this.switchTimeshift(!0, !0) : this.manualSeek(this.video.currentTime + a))
    }, p.prototype.getTimeInPause = function() {
        return (new Date).getTime() - this.pauseTimestamp
    }, p.prototype.storeTimeshiftPauseMarker = function() {
        this.lastPausedPosition = t.currentTime, this.lastPausedRange = this.getStreamRange(), this.timeshiftPauseTimestamp = (new Date).getTime(), k.debug("TSpauseMarkerFinished, streamPosition " + this.lastPausedPosition + ", timestamp " + this.timeshiftPauseTimestamp)
    }, p.prototype.startTimeTick = function() {
        var a = this;
        window.setTimeout(function() {
            a.timeTick()
        }, 1e3)
    }, p.prototype.timeTick = function() {
        if (this.startTimeTick(), this.isHbbTvActive()) return this.hbbtvAutoSwitchTimeshift(), void this.formatHbbtvSeekBarAndVast();
        if ("paused" == this.playerStatus && j.isLive() && !this.waitingForStream) {
            var a = this.getTimeInPause();
            if (k.debug("checking paused live: time in pause=" + a), !this.isTimeshift && a > 1e3 * j.timeShiftOffset) this.switchTimeshift(!0, !0);
            else {
                var b = this.getStreamRange();
                if (o.isShaka && t.currentTime < b.min + 5 && !j.afterTS && (j.isTimeshift ? j.setAfterTS() : j.switchTimeshift(!1, !0)), j.isTimeshift) {
                    var c = ((new Date).getTime() - this.timeshiftPauseTimestamp) / 1e3;
                    k.debug("redraw TS seekbar: paused at " + this.lastPausedPosition + ", currentTime " + t.currentTime + ", elapsed" + c + " seconds elapsed"), o.isHLS && t.currentTime - c < 5 && !j.afterTS && j.setAfterTS();
                    var d;
                    d = j.afterTS ? {
                        min: j.afterTSStreamRange.min + c,
                        max: j.afterTSStreamRange.max + c
                    } : this.lastPausedRange, l.updateSeekBar(this.lastPausedPosition - c, d.min, d.max)
                }
            }
        }
    }, p.prototype.hbbtvAutoSwitchTimeshift = function() {
        if (j.isLive()) {
            var a = 0 - this.timeShiftOffset;
            !this.isTimeshift && this.computeHbbtvPosition() <= a ? this.switchTimeshift(!0, void 0, void 0, !0) : this.isTimeshift && this.computeHbbtvPosition() > a && this.switchTimeshift(!1, void 0, void 0, !0)
        }
    }, p.prototype.setAfterTS = function() {
        this.isHbbTvActive() || (k.info("Zobrazuju konec timeshiftu"), this.afterTSStreamRange = this.getStreamRange(), $(j.mainShellId + " .playerMainShell").addClass("afterTS"), this.sendGemiusEvent("stopped"), o.unload(), this.afterTS = !0)
    }, p.prototype.unsetAfterTS = function() {
        this.isHbbTvActive() || (this.afterTS = !1, $(j.mainShellId + " .playerMainShell").removeClass("afterTS"))
    }, p.prototype.onKeyPress = function(a) {
        if (!j.settings.allControlsHidden) {
            var b = a.which;
            if (k.debug("keyCode", b), 32 == b) $(j.mainShellId + " #overlay").click();
            else if (70 == b) j.isFullScreen || j.toggleFullScreen();
            else if (38 == b) j.setVolume(Math.min(j.getVolume() + 10, 100));
            else if (40 == b) j.setVolume(Math.max(j.getVolume() - 10, 0));
            else if (39 == a.keyCode) "false" != j.settings.jumpIndexKeyboardShortcut && 0 != j.settings.jumpIndexKeyboardShortcut && a.ctrlKey ? j.jumpToIndex(!0) : this.seekBy(5);
            else if (37 == a.keyCode) "false" != j.settings.jumpIndexKeyboardShortcut && 0 != j.settings.jumpIndexKeyboardShortcut && a.ctrlKey ? j.jumpToIndex(!1) : this.seekBy(-5);
            else {
                if (50 != b || !a.shiftKey) return void k.debug("other key");
                l.displayVersionInformation()
            }
            k.debug("stop key propagation"), a.stopPropagation(), a.preventDefault()
        }
    }, p.prototype.toNewWindow = function() {
        var a = 640,
            b = 16 / 9,
            c = Math.ceil(a / b),
            d = screen.width - a - 10,
            e = "newPlayerWindow",
            g = (window.open("", e, "width=" + a + ",height=" + c + ",left=" + d + ",top=0,menubar=no,titlebar=no,status=no,toolbar=no,location=no,scrollbars=no"), this.settings.newWindowBaseUrl);
        void 0 == g && (g = "http://www.ceskatelevize.cz/ivysilani/window");
        var h = [],
            i = window.location.search.replace(/^\?/, "").split("&");
        ["w=99", "external=1"].forEach(function(a) {
            -1 != i.indexOf(a) && h.push(a)
        }), 0 != h.length && (g += "?" + h.join("&"));
        var k = $("<form/>", {
            method: "POST",
            action: g,
            target: e
        });
        [
            ["windowTitle", document.title],
            ["settings", this.settings, !0],
            ["newWindowData", {
                shouldPauseNewWindow: "paused" == this.playerStatus,
                playlistItemIndex: this.currentItemIndex,
                useTimeshift: this.isTimeshift,
                startTime: this.video.currentTime,
                positionCookie: this.positionCookie,
                positionCookieKey: this.positionCookieKey
            }, !0]
        ].forEach(function(a) {
            var b = a[0],
                c = a[1];
            a[2] && (c = JSON.stringify(c)), c = encodeURIComponent(c), k.append($("<input/>", {
                name: b,
                value: c
            }))
        });
        var m = $(j.mainShellId + " #newWindowFormShell");
        m.empty(), m.append(k), k[0].submit(), this.pause(!0)
    }, p.prototype.getCookie = function(a) {
        for (var b = this.getAllCookies(), c = 0; c < b.length; c++) {
            var d = b[c];
            if (d.name == a) return d.value
        }
        return ""
    }, p.prototype.getAllCookies = function() {
        var a = [];
        return void 0 == document.cookie ? a : (document.cookie.split(/; */).forEach(function(b) {
            var c = b.split("=");
            a.push({
                name: c[0],
                value: c[1]
            })
        }), a)
    }, p.prototype.computePositionCookieKey = function() {
        var a = location.pathname;
        if (void 0 != location.search) {
            var b = location.search;
            b = b.replace(/^\?hash=[^&]*$/, ""), b = b.replace(/^\?hash=[^&]*&/, "?"), b = b.replace(/&hash=[^&]*/g, ""), a += b
        }
        this.positionCookieKey = encodeURIComponent(a), k.info("position cookie key: ", this.positionCookieKey)
    }, p.prototype.allocatePositionCookie = function() {
        for (var a = -1, b = this.getAllCookies(), c = [], d = 0; d < b.length; d++) {
            var e = b[d],
                f = /^videopos(\d+)$/.exec(e.name);
            if (null != f) {
                var g = parseInt(f[1]);
                if (this.parsePositionCookie(e.value).key == this.positionCookieKey) return k.info("pre-existing position cookie found:", e.name), void(this.positionCookie = e.name);
                g > a && (a = g), c.push(g)
            }
        }
        var i = a + 1;
        for (c.sort(function(a, b) {
                return a - b
            }), k.info("no pre-existing position cookie. Current position cookies:", c, "total", c.length, "will use new number", i); c.length >= 10;) {
            var j = c.shift();
            k.info("removing position cookie ", j), this.deleteCookie("videopos" + j)
        }
        this.positionCookie = "videopos" + i
    }, p.prototype.deletePositionCookie = function() {
        k.info("Removing position cookie"), this.deleteCookie(this.positionCookie)
    }, p.prototype.parsePositionCookie = function(a) {
        var b = a.split(" ");
        return {
            key: b[0],
            item: parseInt(b[1]),
            time: parseFloat(b[2])
        }
    }, p.prototype.getExpiryString = function() {
        var a = new Date;
        return a.setDate(a.getDate() + 31), "; expires=" + a.toUTCString()
    }, p.prototype.saveCookiesVolume = function() {
        j.saveCookie("volume", j.getVolume())
    }, p.prototype.saveCookiesSubtitles = function() {
        var a = j.selectedSubtitles;
        "subtitlesOff" == j.selectedSubtitles && (a = void 0), j.saveCookie("subtitles", a)
    }, p.prototype.saveCookiesAudiotrack = function() {
        j.saveCookie("audioTrack", j.currentAudioTrack)
    }, p.prototype.saveCookiesVideoquality = function() {
        j.saveCookie("videoQuality", j.currentQuality)
    }, p.prototype.saveCurrentPosition = function() {
        if (this.isInsideVod()) {
            var a = this.positionCookieKey + " " + this.getCurrentItemCanonicalIndex() + " " + this.video.currentTime;
            this.saveCookie(this.positionCookie, a)
        }
    }, p.prototype.saveCookie = function(a, b) {
        void 0 != a && (document.cookie = a + "=" + (void 0 == b ? "" : b) + j.getExpiryString() + ";path=/")
    }, p.prototype.deleteCookie = function(a) {
        var b = new Date(0);
        document.cookie = a + "=; expires=" + b.toUTCString() + ";path=/"
    }, p.prototype.getStreamPosition = function() {
        return j.isLive() ? j.isTimeshift ? Math.min(0, j.video.currentTime - j.getStreamRange().max) - j.timeShiftOffset : void 0 : j.video.currentTime
    }, p.prototype.getGemiusMovieTime = function() {
        return j.isLive() ? 0 : j.video.currentTime
    }, p.prototype.getStreamRange = function() {
        var a = $(j.mainShellId + " #seekBar")[0];
        return {
            min: parseFloat(a.min),
            max: parseFloat(a.max)
        }
    }, p.prototype.isInsideVod = function() {
        return this.isInsideVodOrLive(!1)
    }, p.prototype.isInsideVodOrLive = function(a) {
        return !(void 0 == this.currentItem || j.isLive() && !a || this.currentItem.isVast) && (("playing" == this.playerStatus || "paused" == j.playerStatus) && !this.waitingForStream)
    }, p.prototype.isHbbTvActive = function() {
        return void 0 != this.selectedTvId
    }, p.prototype.sendTrackingEvents = function() {
        if (void 0 != j.currentItem) {
            var a = $(j.mainShellId + " #seekBar")[0];
            j.currentItem.onProgress(parseFloat(a.value), parseFloat(a.max))
        }
    }, p.prototype.checkDeeplinking = function() {
        if (this.isInsideVod()) {
            var a = this.lastLocationHash;
            if (this.lastLocationHash = window.location.hash, a != this.lastLocationHash) {
                if (k.info("Location hash changed: ", this.lastLocationHash, "was", a, "player is ", this.playerStatus), void 0 == this.lastLocationHash) return;
                var b = /t=(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/.exec(this.lastLocationHash);
                if (null == b) return void k.info("bad location");
                for (var c = 0, d = 1; d <= 3; d++) {
                    c *= 60;
                    var e = b[d];
                    void 0 != e && (c += parseInt(e))
                }
                this.seekTo(c)
            }
        }
    }, p.prototype.throwAwayDeeplinkingTarget = function() {
        this.lastLocationHash = window.location.hash
    }, p.prototype.getCurrentItemCanonicalIndex = function() {
        return this.getItemCanonicalIndex(this.currentItemIndex)
    }, p.prototype.getItemCanonicalIndex = function(a) {
        return a - n.getPrerollItemCount()
    }, p.prototype.getItemIndexFromCanonical = function(a) {
        return a + n.getPrerollItemCount()
    }, p.prototype.isLive = function() {
        return this.isHbbTvActive() ? "LIVE" == this.lastKnownHbbtvVideoType : void 0 != this.currentItem && this.currentItem.isLive()
    }, p.prototype.previousItemsTotalTime = function() {
        if (void 0 == this.currentItemIndex) return 0;
        for (var a = this.getCurrentItemCanonicalIndex(), b = 0, c = 0; c < a; c++) {
            var d = n.getPlaylistItem(c).getDuration();
            b += void 0 == d ? 0 : d
        }
        return b
    }, r.prototype.init = function(a) {
        n.ct_playlist = a;
        var b = a.setup.vast;
        n.preRoll = b ? b.preRoll : [], n.postRoll = b ? b.postRoll : [], k.debug("Preroll, postroll"), k.info(j.settings, a)
    }, r.prototype.getItem = function(a) {
        var b = this.getPrerollItemCount();
        if (a < b) return this.getPreRollItem(a);
        a -= b;
        var c = this.getMainPlaylistItemCount();
        return a < c ? this.getPlaylistItem(a) : (a -= c) < this.getPostrollItemCount() ? this.getPostRollItem(a) : void k.debug("no item")
    }, r.prototype.getItemCount = function() {
        return this.getPrerollItemCount() + this.getMainPlaylistItemCount() + this.getPostrollItemCount()
    }, r.prototype.getPrerollItemCount = function() {
        return this.getVastItemCount(this.preRoll)
    }, r.prototype.getPostrollItemCount = function() {
        return this.getVastItemCount(this.postRoll)
    }, r.prototype.getVastItemCount = function(a) {
        return void 0 == a ? 0 : a.length
    }, r.prototype.getMainPlaylistItemCount = function() {
        return this.ct_playlist.playlist.length
    }, r.prototype.getPlaylistItem = function(a) {
        return n.ct_playlist.playlist[a] ? new s(!1, n.ct_playlist.playlist[a]) : void 0
    }, r.prototype.getPreRollItem = function(a) {
        return n.getVastItem(n.preRoll[a])
    }, r.prototype.getPostRollItem = function(a) {
        return n.getVastItem(n.postRoll[a])
    }, r.prototype.getVastItem = function(a) {
        return new s(!0, a)
    }, r.prototype.getPreviewImageUrl = function() {
        return n.ct_playlist.setup.previewImageUrl
    }, r.prototype.getAspect = function() {
        return n.getPlaylistItem(0).getAspect()
    }, r.prototype.getWidth = function() {
        return n.getPlaylistItem(0).getWidth()
    }, r.prototype.getGemius = function() {
        return this.ct_playlist.setup.gemius
    }, s.prototype.getId = function() {
        return this.ctPlaylistItem ? this.ctPlaylistItem.id : void 0
    }, s.prototype.getDuration = function() {
        return this.ctPlaylistItem ? this.ctPlaylistItem.duration : void 0
    }, s.prototype.getRealDuration = function() {
        var a = this.getUrlStartOffset(),
            b = this.getUrlEndOffset();
        return 0 == b && void 0 == (b = this.getDuration()) ? 0 : b - a
    }, s.prototype.getGemiusParams = function() {
        return this.ctPlaylistItem ? this.ctPlaylistItem.gemius : void 0
    }, s.prototype.getAssetId = function() {
        return this.ctPlaylistItem ? this.ctPlaylistItem.assetId : void 0
    }, s.prototype.getTitle = function() {
        return this.ctPlaylistItem ? this.ctPlaylistItem.title : void 0
    }, s.prototype.getStreamUrl = function(a) {
        return this.ctPlaylistItem ? this.ctPlaylistItem.streamUrls[a] : void 0
    }, s.prototype.hasStreamId = function(a) {
        return !!this.ctPlaylistItem && void 0 != this.ctPlaylistItem.streamUrls[a]
    }, s.prototype.hasAudioDescription = function() {
        return this.hasStreamId("audioDescription")
    }, s.prototype.isLive = function() {
        return !this.isVast && ("LIVE" == this.ctPlaylistItem.type || "live" == this.ctPlaylistItem.type)
    }, s.prototype.isVoD = function() {
        return !this.isVast && ("VOD" == this.ctPlaylistItem.type || "vod" == this.ctPlaylistItem.type)
    }, s.prototype.getWidth = function() {
        if (this.isVast) return n.getWidth();
        var a = this.ctPlaylistItem.width;
        if (void 0 !== a) {
            return -1 == ["1200", "960", "640", "480", "320", 1200, 960, 640, 480, 320].indexOf(a) && (k.warn("playlistItem.getWidth error: invalid width '" + a + "' of type " + typeof a + "; using default width 1200"), a = 1200, this.ctPlaylistItem.width = 1200), a
        }
    }, s.prototype.getHeight = function() {
        return this.getWidth() * this.getAspect()
    }, s.prototype.getAspect = function() {
        if (this.isVast) return 16 / 9;
        var a = this.ctPlaylistItem.aspect || "",
            b = a.split(":");
        return 2 != b.length ? 16 / 9 : b[0] / b[1]
    }, s.prototype.getPreviewImageUrl = function() {
        return this.ctPlaylistItem ? this.ctPlaylistItem.previewImageUrl || n.getPreviewImageUrl() : n.getPreviewImageUrl()
    }, s.prototype.getPreviewTrackBaseUrl = function() {
        return this.ctPlaylistItem ? this.ctPlaylistItem.previewTrackBaseUrl : void 0
    }, s.prototype.getStartOffset = function() {
        return this.isVast ? 0 : void 0 !== this.ctPlaylistItem.startOffset ? parseInt(this.ctPlaylistItem.startOffset) : 0
    }, s.prototype.getEndOffset = function() {
        return this.isVast ? 0 : void 0 !== this.ctPlaylistItem.endOffset ? parseInt(this.ctPlaylistItem.endOffset) : 0
    }, s.prototype.getUrlStartOffset = function() {
        var a = this.urlStartOffset;
        return void 0 == a && (a = 0), a
    }, s.prototype.getUrlEndOffset = function() {
        var a = this.urlEndOffset;
        return void 0 == a && (a = 0), a
    }, s.prototype.getIndexes = function() {
        if (this.isVast) return [];
        if (void 0 === this.indexes) {
            var a = this.ctPlaylistItem.indexes;
            if (this.indexes = [], void 0 != a)
                for (var b = 0; b < a.length; b++) {
                    var c = a[b],
                        d = {};
                    d.title = c.title, d.time = parseInt(c.time), d.imageUrl = c.imageURL, this.indexes.push(d)
                }
        }
        return this.indexes
    }, s.prototype.getSkipDelay = function() {
        return this.isVast ? this.skipOffset : this.ctPlaylistItem.skipDelay
    }, s.prototype.getClickThroughUrl = function() {
        return this.clickThroughUrl
    }, s.prototype.getSubtitlesInfo = function() {
        return this.isVast ? [] : this.ctPlaylistItem.subtitles
    }, s.prototype.getSubtitlesLoader = function(a) {
        return this.subtitleLoaders[a]
    }, s.prototype.loadAndPlay = function(a, b, c) {
        k.info("Loading streamId", b), j.showLoadingScreen(), $(j.video).find("track").remove(), this.remainingProgressEvents = [], this.nonProgressEvents = {};
        var d = [];
        if (this.subtitleLoaders = d, this.isVast) {
            var e = this.vastUrl,
                f = this;
            $.ajax(e, {
                beforeSend: function() {}
            }).success(function(b) {
                if ("object" == typeof b) {
                    k.info("VAST loaded", b, b.VAST, f.isVast);
                    var d = $(b).find("Linear")[0],
                        g = void 0 == d ? 0 : f.parseVastTime(d.getAttribute("skipoffset"));
                    f.skipOffset = g, f.clickThroughUrl = $(b).find("ClickThrough").text().trim(), "" == f.clickThroughUrl && (f.clickThroughUrl = void 0);
                    var h = {
                        creativeView: 0,
                        start: 0,
                        firstQuartile: 25,
                        midpoint: 50,
                        thirdQuartile: 75
                    };
                    $(b).find("TrackingEvents > Tracking").each(function() {
                        var a = this.getAttribute("event"),
                            b = this.textContent.trim(),
                            c = h[a];
                        if (void 0 != c) f.addProgressEvent("percent", c, b);
                        else if ("progress" == a) {
                            var d = this.getAttribute("offset");
                            void 0 != d && "" != d && ("%" == d.charAt(d.length - 1) ? f.addProgressEvent("percent", parseInt(d), b) : f.addProgressEvent("seconds", f.parseVastTime(d), b))
                        } else f.addNonProgressEvent(a, b)
                    }), k.info("tracking events", f.remainingProgressEvents), k.info("tracking events", f.nonProgressEvents);
                    for (var i, l = $(b).find("MediaFile").toArray(), m = 0; m < l.length; m++) {
                        var n = l[m];
                        k.debug("File ", m, " of ", l.length, n);
                        var p = $(n).text().trim();
                        k.debug("checking ", p);
                        var q = f.parseParamFromUrl(p, "playerType");
                        if ("flash" == q && "HLS" == a || "dash" == q && "DASH" == a) {
                            k.info("playing advertisement"), o.playStream(p, c), i = n;
                            break
                        }
                        k.info("playerType vs streamingProtocol mismatch; skipping", q, a)
                    }
                    void 0 == i && (k.warn("no MediaFile with usable type found"), j.playNextItem())
                } else k.info("empty vast response for url ", e, "; skipping"), j.playNextItem()
            }).error(function(a) {
                k.warn("Error loading vast response from ", e, "; skipping"), j.playNextItem()
            })
        } else {
            this.startSubtitleLoaders();
            var g = this.getStreamUrl(b);
            this.urlStartOffset = this.parseIntParamFromUrl(g, "startOffset", 0), this.urlEndOffset = this.parseIntParamFromUrl(g, "endOffset", 0), k.debug("url offsets: ", this.urlStartOffset, this.urlEndOffset), a == o.playerType ? (k.info("loading stream " + b), o.playStream(this.getStreamUrl(b), c)) : k.error("Streamin protocol mismatch")
        }
    }, s.prototype.startSubtitleLoaders = function() {
        this.ctPlaylistItem.subtitles.forEach(function(a) {
            if (j.settings.useNativeVideoPlayer) {
                var b = document.createElement("track");
                return b.kind = "subtitles", b.label = a.title, b.srclang = j.getLanguageCode(a.title), b.src = a.url, j.video.appendChild(b), void b.addEventListener("load", function() {
                    k.debug("showing native subtitles track", this), this.mode = "showing"
                })
            }
            var c = {
                status: "loading",
                readyCallbacks: [],
                load: function() {
                    k.info("Loading subtitles from", a.url), $.ajax({
                        url: a.url,
                        beforeSend: function() {},
                        context: this,
                        success: function(b) {
                            k.info("Parsing subtitles", a.url);
                            var c = new WebVTT.Parser(window, WebVTT.StringDecoder()),
                                d = [];
                            this.data = d, c.onregion = function(a) {}, c.oncue = function(a) {
                                d.push(a)
                            }, c.onflush = function() {}, c.onparsingerror = function(a) {};
                            var e = this,
                                f = window.setInterval(function() {
                                    var d, g = 1e4;
                                    d = b.substr(0, g), b = b.substr(g), c.parse(d), "" == b && (window.clearInterval(f), c.flush(), e.status = "ready", k.info("Subtitles loaded from", a.url), e.fireReadyCallbacks())
                                }, 10)
                        },
                        error: function() {
                            this.status = "error", this.readyCallbacks = [], k.warn("Subtitles load error:", a.url), j.logEvent("errors", "subtitles_load")
                        }
                    })
                },
                callWhenReady: function(a) {
                    "error" != this.status && (this.readyCallbacks.push(a), "loading" != this.status && this.fireReadyCallbacks())
                },
                fireReadyCallbacks: function() {
                    var a = this.readyCallbacks.splice(0, this.readyCallbacks.length),
                        b = this.data;
                    a.forEach(function(a) {
                        a.call(void 0, b)
                    })
                }
            };
            c.load(), this.subtitleLoaders.push(c)
        }, this)
    }, s.prototype.parseIntParamFromUrl = function(a, b, c) {
        var d = this.parseParamFromUrl(a, b);
        return void 0 == d ? c : parseInt(d)
    }, s.prototype.parseParamFromUrl = function(a, b) {
        var c = /(\?[^#]*)/.exec(a);
        if (null != c) {
            var d = c[1],
                e = new RegExp("(?:\\?|&)" + b + "=([^&]+)").exec(d);
            return null == e ? void 0 : e[1]
        }
    }, s.prototype.parseVastTime = function(a) {
        if (void 0 == a) return 0;
        var b = /^(\d\d):(\d\d):(\d\d)(?:\.(\d\d\d))?$/.exec(a);
        if (null == b) return 0;
        var c = 3600 * parseInt(b[1]) + 60 * parseInt(b[2]) + parseInt(b[3]);
        return void 0 != b[4] && (c += parseInt(b[4]) / 1e3), c
    }, s.prototype.addProgressEvent = function(a, b, c) {
        this.remainingProgressEvents.push({
            offsetUnit: a,
            offset: b,
            url: c
        })
    }, s.prototype.addNonProgressEvent = function(a, b) {
        this.nonProgressEvents[a] = b
    }, s.prototype.onProgress = function(a, b) {
        var c = this;
        this.remainingProgressEvents = this.remainingProgressEvents.filter(function(d) {
            var e;
            return "percent" == d.offsetUnit ? e = b * (d.offset / 100) : "seconds" == d.offsetUnit && (e = d.offset), !(a >= e) || (c.sendTrackingEvent(d.url), !1)
        })
    }, s.prototype.onEnded = function() {
        this.sendTrackingEvent(this.nonProgressEvents.complete)
    }, s.prototype.onMute = function() {
        this.sendTrackingEvent(this.nonProgressEvents.mute)
    }, s.prototype.onUnmute = function() {
        this.sendTrackingEvent(this.nonProgressEvents.unmute)
    }, s.prototype.onResume = function() {
        this.sendTrackingEvent(this.nonProgressEvents.resume)
    }, s.prototype.onFullscreen = function() {
        this.sendTrackingEvent(this.nonProgressEvents.fullscreen)
    }, s.prototype.onExitFullscreen = function() {
        this.sendTrackingEvent(this.nonProgressEvents.exitFullscreen)
    }, s.prototype.onSkip = function() {
        this.sendTrackingEvent(this.nonProgressEvents.skip)
    }, s.prototype.sendTrackingEvent = function(a) {
        void 0 != a && (k.info("launch event ", a), $.ajax(a, {
            beforeSend: function() {}
        }))
    };
    var t = null;
    return u.prototype.init = function() {
        k.info("PLAYER INIT!!!!!!!!!!"), t.addEventListener("timeupdate", function(a) {
            l.onTimeUpdate(a)
        }), t.addEventListener("progress", function(a) {
            l.onBufferProgress(a)
        }), t.addEventListener("ended", function(a) {
            j.onStreamEnd()
        }), t.addEventListener("loadeddata", function(a) {
            o.onLoadedData(), j.onStreamLoaded()
        }), t.addEventListener("play", function(a) {
            j.onVideoPlayEvent()
        }), t.addEventListener("pause", function(a) {
            j.onVideoPausedEvent()
        }), t.addEventListener("waiting", function(a) {
            j.onVideoWaitingEvent()
        }), t.addEventListener("seeking", function(a) {
            j.onVideoSeekingEvent()
        })
    }, u.prototype.onLoadedData = function() {}, u.prototype.play = function() {
        t.play()
    }, u.prototype.pause = function() {
        t.pause()
    }, u.prototype.unpause = function() {
        t.play()
    }, u.prototype.replay = function() {
        t.currentTime = 0, t.play()
    }, u.prototype.setAutoPlay = function(a) {
        k.info("playerPlayer.setAutoPlay", a), a ? ($(t).attr("preload", "auto"), $(t).attr("autoplay", "")) : ($(t).attr("preload", "metadata"), $(t).removeAttr("autoplay"))
    }, u.prototype.getVideoDuration = function() {
        return t.duration
    }, u.prototype.breakOutOfPromise_ = function(a) {
        return window.setTimeout.bind(window, a, 0)
    }, u.prototype.onPlayerError_ = function(a, b, c, d, e) {
        k.error("player error:", a), j.scheduleVideoErrorScreen(1e3, !0, b, c, d, e)
    }, u.prototype.setQuality = function(a, b) {
        this.setQualityInternal(a, b), this.lastSelectedQuality = a, this.lastSelectedMaxBitrate = b
    }, u.prototype.setQualityInternal = function(a, b) {}, v.prototype = Object.create(u.prototype), v.prototype.constructor = v, v.prototype.parent = u.prototype, v.prototype.playerType = "DASH", v.prototype.isShaka = !0, v.prototype.isHLS = !1, v.prototype.init = function() {
        this.parent.init(), this.polyfillsInstalled || (shaka.polyfill.installAll(), this.polyfillsInstalled = !0), void 0 !== shaka.log && shaka.log.setLevel(shaka.log.Level.NONE), this.shakaPlayer = new shaka.Player(t), k.info("init - shaka player created"), this.shakaPlayer.configure({
            drm: {
                servers: {
                    "com.widevine.alpha": "http://88.103.240.99/license?access_token=feed-dead-beef-babe"
                }
            }
        }), k.info("DRM widevine configured");
        var a = this;
        this.shakaPlayer.addEventListener("error", function(b) {
            a.onShakaPlayerError(b.detail)
        }), this.shakaPlayer.addEventListener("adaptation", function() {
            a.streamCurrentlyLoading || (j.updateAutoQualityInfo(), a.selectAudioForVideo())
        }), window.setInterval(function() {
            a.seekRangeCheck()
        }, 1e3)
    }, v.prototype.onShakaPlayerError = function(a) {
        this.onPlayerError_(a, "shakaError", void 0, a.category, a.code)
    }, v.prototype.seekRangeCheck = function() {
        var a = this.shakaPlayer.seekRange();
        this.lastRangeStart == a.start && this.lastRangeEnd == a.end || m.onSeekRangeChanged(a), this.lastRangeStart = a.start, this.lastRangeEnd = a.end
    }, v.prototype.onLoadedData = function() {
        this.qualities = [], this.audioLanguages = [], this.audioQualityRange = {}, this.streamCurrentlyLoading = !1, this.shakaPlayer.getTracks().forEach(function(a) {
            if ("video" == a.type) this.qualities.push({
                id: a.id,
                bandwidth: this.recomputeInvalidBandwidth(a.bandwidth)
            });
            else if ("audio" == a.type) {
                var b = a.bandwidth;
                void 0 == b && (b = 0);
                var c = a.language;
                "und" != c && void 0 != c || (c = "cs");
                var d = this.audioQualityRange[c];
                void 0 == d ? (this.audioLanguages.push(c), this.audioQualityRange[c] = {
                    min: b,
                    max: b
                }) : (d.min = Math.min(d.min, b), d.max = Math.max(d.max, b)), a.active && (this.currentAudioLanguage = c)
            }
        }, this), this.qualities.sort(function(a, b) {
            return b.bandwidth - a.bandwidth
        }), k.info("Video qualities", this.qualities), k.info("Audio languages", this.audioLanguages), k.info("Audio quality ranges", this.audioQualityRange), k.info("Current audio language", this.currentAudioLanguage), this.selectAudioForVideo(), this.seekRangeCheck()
    }, v.prototype.recomputeInvalidBandwidth = function(a) {
        return a < 372e3 ? a + 96e3 : a + 128e3
    }, v.prototype.stop = function() {
        void 0 !== this.shakaPlayer && this.shakaPlayer.unload()
    }, v.prototype.getCurrentBandwidth = function() {
        for (var a = this.getTracksOfType("video"), b = 0; b < a.length; b++)
            if (a[b].active) return this.recomputeInvalidBandwidth(a[b].bandwidth)
    }, v.prototype.getAudioTracks = function() {
        return this.audioLanguages
    }, v.prototype.playStream = function(a, b) {
        k.info("Loading DASH stream from " + a), void 0 == a && k.error("STREAM not defined - ERROR!!"), this.shakaPlayer.configure({
            restrictions: {
                minVideoBandwidth: 0,
                maxVideoBandwidth: 1 / 0,
                minAudioBandwidth: 0,
                maxAudioBandwidth: 1 / 0
            }
        }), this.streamCurrentlyLoading = !0;
        var c = this;
        this.shakaPlayer.load(a, b).then(void 0, function(a) {
            c.onShakaPlayerError(a)
        })
    }, v.prototype.getVideoTracks = function() {
        return this.qualities
    }, v.prototype.getTracksOfType = function(a) {
        return this.shakaPlayer.getTracks().filter(function(b) {
            return b.type == a
        })
    }, v.prototype.setQualityInternal = function(a, b) {
        var c = "auto" == a,
            d = c && void 0 != b ? 1e3 * b : 1 / 0;
        this.shakaPlayer.configure({
            abr: {
                enabled: c
            },
            restrictions: {
                maxVideoBandwidth: d
            }
        }), "auto" != a && this.selectTrack("video", a), this.selectAudioForVideo()
    }, v.prototype.selectAudioTrack = function(a) {
        "ad" == a && (a = "cs");
        var b = this.computeAudioRestrictions(a);
        this.shakaPlayer.configure({
            restrictions: b
        }), this.currentAudioLanguage = a
    }, v.prototype.computeAudioRestrictions = function(a) {
        var c, d, b = this.getCurrentBandwidth();
        c = b < 5e5 ? 96e3 : 128e3;
        var e = this.audioQualityRange[a];
        return d = void 0 == e ? {
            minAudioBandwidth: 0,
            maxAudioBandwidth: 1 / 0
        } : {
            minAudioBandwidth: Math.min(c, e.max),
            maxAudioBandwidth: Math.max(c, e.min)
        }, k.info("Use audio restrictions:", d), d
    }, v.prototype.selectAudioForVideo = function() {
        var a = this.computeAudioRestrictions(this.currentAudioLanguage),
            b = this.shakaPlayer.getConfiguration().restrictions;
        b.minAudioBandwidth == a.minAudioBandwidth && b.maxAudioBandwidth == a.maxAudioBandwidth || this.shakaPlayer.configure({
            restrictions: a
        })
    }, v.prototype.selectTrack = function(a, b) {
        this.getTracksOfType(a).forEach(function(a) {
            a.id == b && this.shakaPlayer.selectTrack(a)
        }, this)
    }, v.prototype.unload = function() {
        this.shakaPlayer.unload()
    }, w.prototype = Object.create(u.prototype), w.prototype.constructor = w, w.prototype.parent = u.prototype, w.prototype.playerType = "HLS", w.prototype.isShaka = !1, w.prototype.isHLS = !0, w.prototype.init = function() {
        this.parent.init();
        var a = this;
        t.addEventListener("durationchange", function(a) {
            m.onSeekRangeChanged(a)
        }), t.addEventListener("error", function(b) {
            a.onHLSPlayerError(b)
        })
    }, w.prototype.onHLSPlayerError = function(a) {
        var b = void 0 == t.error ? void 0 : t.error.code;
        this.onPlayerError_(a, "videoError", b, void 0, void 0)
    }, w.prototype.onLoadedData = function() {}, w.prototype.stop = function() {
        this.unload()
    }, w.prototype.playStream = function(a) {
        k.info("Loading HLS stream from " + a), $(t).attr("src", a), $(t).load()
    }, w.prototype.getVideoTracks = function() {}, w.prototype.getAudioTracks = function() {
        return ["cs"]
    }, w.prototype.setQualityInternal = function(a, b) {}, w.prototype.selectAudioTrack = function(a) {}, w.prototype.getCurrentBandwidth = function() {}, w.prototype.unload = function() {
        var a = $(t);
        a.removeAttr("src"), a[0].load()
    }, x.prototype.enterElement = function(a) {
        var b = $(a).attr("id");
        if (-1 == this.inside.indexOf(b)) {
            var c = this.inside.length;
            this.inside.push(b), 0 == c && void 0 != this.nonEmptyCallback && this.nonEmptyCallback.call()
        }
    }, x.prototype.leaveElement = function(a) {
        var b = $(a).attr("id"),
            c = this.inside.indexOf(b); - 1 != c && (this.inside.splice(c, 1), 0 == this.inside.length && void 0 != this.emptyCallback && this.emptyCallback.call())
    }, x.prototype.isInElement = function() {
        return this.inside.length > 0
    }, y.prototype.setTimeout = function(a, b, c) {
        this.cancel();
        var d = this;
        this.timeout = window.setTimeout(function() {
            d.timeout = void 0, d.target.apply(b, c)
        }, a)
    }, y.prototype.setInterval = function(a, b, c) {
        this.cancel();
        var d = this;
        this.interval = window.setInterval(function() {
            d.target.apply(b, c)
        }, a)
    }, y.prototype.cancel = function() {
        void 0 != this.timeout && (k.debug("clearing timeout"), window.clearTimeout(this.timeout), this.timeout = void 0), void 0 != this.interval && (window.clearTimeout(this.interval), this.interval = void 0)
    }, y.prototype.isScheduled = function() {
        return void 0 != this.timeout || void 0 != this.interval
    }, z.initializeGlobal = function() {
        k.info("initializing document listener"), this.prototype.supportsTouch = !!("ontouchstart" in window || navigator.msMaxTouchPoints), k.info("supportsTouch:", this.prototype.supportsTouch), this.prototype.supportsTouch && k.info("will use touch events on elements"), k.info("installing document.mouseup"), document.addEventListener("mouseup", function(a) {
            z.prototype.stopDragging(a, "mouse")
        }, !0), document.addEventListener("mousemove", function(a) {
            z.prototype.onMove(a, "mouse")
        }, !0)
    }, z.prototype.startDragging = function(a, b) {
        if (k.debug("start dragging", this.supportsTouch, b), z.prototype.current == this) return k.debug("ignoring", b, "event, already dragging with the same control"), a.preventDefault(), void a.stopPropagation();
        z.prototype.current = this, this.currentControlType = b, this.lastPosition = this.extractPosition(a), this.consumer.startDragging(this, this.element, this.lastPosition), a.preventDefault(), a.stopPropagation()
    }, z.prototype.stopDragging = function(a, b) {
        var c = z.prototype.current;
        if (void 0 != c) {
            k.debug("stop dragging"), a.preventDefault(), a.stopPropagation();
            var d = c.extractPosition(a);
            void 0 != d.pageX && void 0 != d.pageY && (c.lastPosition = d), c.consumer.stopDragging(c, c.element, c.lastPosition);
            var e = function(a) {
                k.debug("preventing click after dragging"), a.stopPropagation(), document.removeEventListener("click", e, !0)
            };
            document.addEventListener("click", e, !0), window.setTimeout(function() {
                document.removeEventListener("click", e, !0)
            }, 200)
        }
        z.prototype.current = void 0
    }, z.prototype.onMove = function(a, b) {
        void 0 != z.prototype.current && z.prototype.current.handleMove(a, b)
    }, z.prototype.handleMove = function(a, b) {
        if (a.preventDefault(), a.stopPropagation(), a.stopImmediatePropagation(), b != this.currentControlType) return void k.debug("using", this.currentControlType, "events, ignoring", b);
        this.lastPosition = this.extractPosition(a), k.debug("handleMove", b, this.lastPosition), this.consumer.dragging(this, this.element, this.lastPosition)
    }, z.prototype.extractPosition = function(a) {
        var c, b = this.element.getBoundingClientRect();
        return c = void 0 == a ? {} : void 0 != a.changedTouches && a.changedTouches.length > 0 ? a.changedTouches[0] : a, {
            pageX: c.pageX,
            pageY: c.pageY,
            elementX: c.clientX - b.left,
            elementY: c.clientY - b.top
        }
    }, A.prototype.loadFile = function(a, b, c, d) {
        k.info("loading file", a), this.pendingFileCount++;
        var e = this;
        $.ajax({
            url: a,
            beforeSend: function() {},
            success: function(c) {
                k.info("loaded file", a), void 0 != b && b.call(d, a, c), e.onFileFinished()
            },
            error: function() {
                k.warn("error loading file", a), void 0 != c && c.call(d, a), e.onFileFinished()
            }
        })
    }, A.prototype.callAfterAllReady = function(a, b, c) {
        this.allReadyCallbacks.push(function() {
            a.apply(b, c)
        }), this.maybeFireAllReadyCallbacks()
    }, A.prototype.onFileFinished = function() {
        this.pendingFileCount--, k.info("pending files:", this.pendingFileCount), this.maybeFireAllReadyCallbacks()
    }, A.prototype.maybeFireAllReadyCallbacks = function() {
        if (this.pendingFileCount > 0) k.info("still waiting for files", this.pendingFileCount);
        else {
            k.info("executing all-ready callbacks");
            this.allReadyCallbacks.splice(0, this.allReadyCallbacks.length).forEach(function(a) {
                a.call(this)
            })
        }
    }, B.prototype.checkBindSupported = function() {
        this.bindSupported = void 0 != console && void 0 != console.log && void 0 != console.log.bind && typeof("function" == console.log.bind)
    }, B.prototype.setLogLevel = function(a) {
        this.level = a;
        var b = this.levelNames.indexOf(a);
        this.levelNames.forEach(function(a, c) {
            var d;
            d = c <= b ? console.log.bind(console, a.toUpperCase() + "\t") : function() {}, this[a.toLowerCase()] = d
        }, this), this.warn = this.warning
    }, j.setCompiled(!0), j.init.apply(j, arguments)
}