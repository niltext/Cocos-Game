

cc.Class({
    extends: cc.Component,

    properties: {
        panel: cc.Node,
        manifestUrl: cc.RawAsset,
        _updating: false,
        _canRetry: false,

        progressbar: cc.ProgressBar,
        info: cc.Label,
        version: cc.Label,

        _delegate: null,

    },

    checkCb: function (event) {
        cc.log('checkCb.Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.info.string = "No local manifest file found, hot update skipped.";
                cc.nc.log("No local manifest file found, hot update skipped.")
                this._delegate.onUpdateFinished();
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.info.string = "Fail to download manifest file, hot update skipped.";
                cc.nc.log("Fail to download manifest file, hot update skipped.")
                cc.alert({ content: '检查更新失败，请检查网络！', ok: '退出', cancel: '重连' },
                    () => {
                        cc.game.end();
                    }, true, () => {
                        cc.game.restart();
                    });

                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.info.string = "已更新到新版本！";
                cc.nc.log("已更新到新版本！")
                this.progressbar.progress = 1;
                this._delegate.onUpdateFinished();
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.info.string = '检测到新内容，开始更新。';
                cc.nc.log("检测到新内容，开始更新。")

                // this.panel.fileProgress.progress = 0;
                // this.panel.byteProgress.progress = 0;
                this.progressbar.progress = 0;
                //检测到更新，自动开始更新
                this._updating = false;
                this.hotUpdate();
                break;
            default:
                return;
        }

        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;
        this._updating = false;
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.info.string = 'No local manifest file found, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                // this.panel.byteProgress.progress = event.getPercent() / 100;
                // this.panel.fileProgress.progress = event.getPercentByFile() / 100;
                this.progressbar.progress = event.getPercent() / 100;

                var msg = event.getMessage();
                //if (msg) {
                    let prog = '正在更新...  '+event.getPercent().toFixed(2) + '%'
                    this.info.string = prog;
                    //cc.log(prog + msg);
                //}
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.info.string = '下载 manifest 文件失败, code:'+event.getEventCode();
                cc.nc.log('下载 manifest 文件失败, code:'+event.getEventCode())
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.info.string = '已更新到新版本！';
                cc.nc.log('已更新到新版本！')
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.info.string = '更新完成' + event.getMessage();
                cc.nc.log('Update finished. ' + event.getMessage())
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.info.string = '更新失败 ' + event.getMessage();
                cc.nc.log('更新失败' + event.getMessage())
                //this.panel.retryBtn.active = true;
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.info.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                cc.nc.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage())
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.info.string = event.getMessage();
                cc.nc.log(event.getMessage())
                break;
            default:
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            this._updating = false;

            let self = this;
            if (this._canRetry) {
                cc.alert({ content: '糟糕，更新出现问题了！', ok: '退出', cancel: '重试' },
                    () => {
                        cc.game.end();
                    }, true, () => {
                        self.retry();
                    });
            }
        }

        cc.nc.log('-->needRestart:' + needRestart)
        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));

            jsb.fileUtils.setSearchPaths(searchPaths);
            cc.game.restart();
        }
    },

    retry: function () {
        if (!this._updating && this._canRetry) {
            //this.panel.retryBtn.active = false;
            this._canRetry = false;

            this.info.string = 'Retry failed Assets...';
            this._am.downloadFailedAssets();
        }
    },

    checkUpdate: function (delegate) {
        if (delegate) {
            this._delegate = delegate;
        }

        if (this._updating) {
            this.info.string = '检查更新 ...';
            return;
        }
        if (!this._am.getLocalManifest().isLoaded()) {
            this.info.string = 'Failed to load local manifest ...';
            return;
        }
        if (!this._checkListener) {
            this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
            cc.eventManager.addListener(this._checkListener, 1);
        }

        this._am.checkUpdate();
        this._updating = true;
    },

    hotUpdate: function () {
        if (this._am && !this._updating) {
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            this._failCount = 0;
            this._am.update();
            this._updating = true;
        }
    },

    show: function () {

    },

    // use this for initialization
    onLoad: function () {
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            return;
        }
        this.info.string = '';

        var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'zpw');
        cc.log('Storage path for remote asset : ' + storagePath);
        //cc.nc.log('Storage path for remote asset : ' + storagePath);

        cc.log('Local manifest URL : ' + this.manifestUrl);
        this._am = new jsb.AssetsManager(this.manifestUrl, storagePath);
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.retain();
        }

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this._am.setVersionCompareHandle(function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        });

        var info = this.info;
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                //info.string = "Verification passed : " + relativePath;
                return true;
            }
            else {
                //info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                return true;
            }
        });

        cc.log('Hot update is ready, please check or directly update.');
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);
            //this.info.string = "Max concurrent tasks count have been limited to 2";
        }

        // this.panel.fileProgress.progress = 0;
        // this.panel.byteProgress.progress = 0;
        this.progressbar.progress = 0;

        cc.utils.version = this._am.getLocalManifest().getVersion()
        this.version.string = cc.utils.version;

    },

    onDestroy: function () {
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
        if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.release();
        }
    }
});
