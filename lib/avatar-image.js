/*Adapted from https://github.com/sitebase/react-avatar */
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailspring_exports_1 = require("mailspring-exports");
const prop_types_1 = __importDefault(require("prop-types"));
const create_react_class_1 = __importDefault(require("create-react-class"));
const md5_1 = __importDefault(require("md5"));
const isRetina = require('is-retina')();
const AvatarImage = (0, create_react_class_1.default)({
    displayName: 'AvatarImage',
    getProtocol: function () {
        if (typeof window === 'undefined')
            return 'https:';
        return window.location.protocol;
    },
    shouldComponentUpdate(nextProps, nextState) {
        return !mailspring_exports_1.Utils.isEqualReact(nextProps, this.props) || !mailspring_exports_1.Utils.isEqualReact(nextState, this.state);
    },
    /**
     * Gravatar implementation
     * @param  {string}   email MD5 hash or plain text email address
     * @param  {int}   size
     * @param  {Function} cb
     * @return {void}
     */
    getGravatarURL: function (email, size, cb, tryNext) {
        var base = 'gravatar.com/avatar/<%=id%>?s=<%=size%>&d=404';
        // if email does not contain @ it's already an MD5 hash
        if (email.indexOf('@') > -1)
            email = (0, md5_1.default)(email);
        var prefix = this.getProtocol() === 'https:' ? 'https://secure.' : 'http://';
        size = isRetina ? size * 2 : size;
        cb(prefix + this.parse(base, { id: email, size: size }));
    },
    getClearbitURL: function (email, size, cb, tryNext) {
        var base = "logo.clearbit.com/<%=domain%>";
        var domain;
        if (email.indexOf('@') > -1)
            domain = email.split('@')[1];
        var prefix = this.getProtocol() === 'https:' ? 'https://secure.' : 'http://';
        cb(prefix + this.parse(base, { domain: domain }));
    },
    /**
     * Facebook implementation
     * @param  {string|int}   id
     * @param  {int}   size
     * @param  {Function} cb
     * @return {void}
     */
    getFacebookURL: function (id, size, cb, tryNext) {
        var base = 'graph.facebook.com/<%=id%>/picture?width=<%=size%>';
        cb(this.getProtocol() + '//' + this.parse(base, { id: id, size: size }));
    },
    /**
     * Google+ implementation
     * @param  {int}   id
     * @param  {int}   size
     * @param  {Function} cb
     * @return {void}
     */
    getGoogleURL: function (id, size, cb, tryNext) {
        var base = 'picasaweb.google.com/data/entry/api/user/<%=id%>?alt=json';
        var url = this.getProtocol() + '//' + this.parse(base, { id: id });
        this.get(url, function (data) {
            var src = data.entry.gphoto$thumbnail.$t.replace('s64', 's' + size); // replace with the correct size
            cb(src);
        }, tryNext);
    },
    /**
     * Skype implementation
     * @param  {string}   id
     * @param  {int}   size
     * @param  {Function} cb
     * @return {void}
     */
    getSkypeURL: function (id, size, cb, tryNext) {
        var base = 'api.skype.com/users/<%=id%>/profile/avatar';
        cb(this.getProtocol() + '//' + this.parse(base, { id: id }));
    },
    /**
     * Replace variables in a string
     * @param  {string} value String that will be parsed
     * @param  {Object} variables    Key value object
     * @return {string}
     */
    parse: function (value, variables) {
        for (var variable in variables) {
            value = value.replace('<%=' + variable + '%>', variables[variable]);
        }
        return value;
    },
    /**
     * Return a random color
     * @return {string}
     */
    rndColor: function () {
        var colors = ['#d73d32', '#7e3794', '#4285f4', '#67ae3f', '#d61a7f', '#ff4080'];
        var index = Math.floor(Math.random() * colors.length);
        return colors[index];
    },
    /**
     * Convert a name into initials
     * @param {string} name
     * @return {string}
     */
    getInitials: function (name) {
        console.log(name);
        var parts = name.split(' ');
        var initials = parts[0].substring(0, 1).toUpperCase();
        if (parts.length > 1) {
            initials += parts[parts.length - 1].substring(0, 1).toUpperCase();
        }
        // for(var i=0 ; i < parts.length ; i++)
        // {
        //     initials += parts[i].substr(0, 1).toUpperCase();
        // }
        return initials;
    },
    /**
     * Do an ajax request to fetch remote data
     * @param  {string}   url
     * @param  {Function} cb
     * @return {void}
     */
    get: function (url, successCb, errorCb) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    var data = JSON.parse(request.responseText);
                    successCb(data);
                }
                else {
                    errorCb(request.status);
                }
            }
        };
        request.open('GET', url, true);
        request.send();
    },
    /**
     * Set the src attribute of the image element use to display the avatar
     * @param {string} src
     */
    setSrc: function (src) {
        if (src === null)
            return;
        this.trySetState({ src: src });
    },
    propTypes: {
        className: prop_types_1.default.string,
        fgColor: prop_types_1.default.string,
        color: prop_types_1.default.string,
        name: prop_types_1.default.string,
        value: prop_types_1.default.string,
        email: prop_types_1.default.string,
        facebookId: prop_types_1.default.string,
        googleId: prop_types_1.default.string,
        skypeID: prop_types_1.default.string,
        round: prop_types_1.default.bool,
        size: prop_types_1.default.number
    },
    getInitialState: function () {
        return {
            src: null,
            value: null,
            triedFacebook: false,
            triedGoogle: false,
            triedSkype: false,
            triedGravatar: false,
            triedClearbit: false,
        };
    },
    getDefaultProps: function () {
        return {
            fgColor: '#FFF',
            color: null,
            name: null,
            value: null,
            email: null,
            facebookId: null,
            skypeId: null,
            googleId: null,
            round: false,
            size: 32
        };
    },
    // componentWillMount: function() {
    //   this.fetch();
    // },
    componentDidMount: function () {
        // this.fetch();
        if (this.props.name)
            this.trySetState({ value: this.getInitials(this.props.name) });
    },
    componentWillReceiveProps: function (newProps) {
        /**
         * This component ignores changes in `this.props.src`, `this.props.name`, and
         * `this.props.value`. This lifecycle method will allow users to change the avatars name or
         * value.
         */
        if (newProps.value && newProps.value !== this.props.value) {
            this.trySetState({ value: this.getInitials(newProps.name) });
        }
        // if (newProps.src && newProps.src !== this.props.src) {
        //     this.trySetState({ src: newProps.src });
        // } else if (newProps.name && newProps.name !== this.props.name) {
        //     this.trySetState({ value: this.getInitials(newProps.name) });
        // } else if (newProps.value && newProps.value !== this.props.value) {
        //     this.trySetState({ value: newProps.value });
        // }
    },
    trySetState: function (hash) {
        if (this.isMounted()) { //bad antipattern
            this.setState(hash);
        }
    },
    fetch: function (e) {
        var url = null;
        var self = this;
        var tryNext = function () {
            self.fetch();
        };
        // If fetch was triggered by img onError
        // then set state src back to null so getVisual will
        // automatically switch to drawn avatar if there is no other social ID available to try
        if (e && e.type === "error") {
            this.state.src = null;
        }
        if (this.state.triedFacebook === false && !this.state.url && this.props.facebookId) {
            this.state.triedFacebook = true;
            this.getFacebookURL(this.props.facebookId, this.props.size, this.setSrc, tryNext);
            return;
        }
        if (this.state.triedGoogle === false && !this.state.url && this.props.googleId) {
            this.state.triedGoogle = true;
            this.getGoogleURL(this.props.googleId, this.props.size, this.setSrc, tryNext);
            return;
        }
        if (this.state.triedSkype === false && !this.state.url && this.props.skypeId) {
            this.state.triedSkype = true;
            this.getSkypeURL(this.props.skypeId, this.props.size, this.setSrc, tryNext);
            return;
        }
        if (this.state.triedGravatar === false && !this.state.url && this.props.email) {
            this.state.triedGravatar = true;
            this.getGravatarURL(this.props.email, this.props.size, this.setSrc, tryNext);
            return;
        }
        if (this.state.triedClearbit === false && !this.state.url && this.props.email) {
            this.state.triedClearbit = true;
            this.getClearbitURL(this.props.email, this.props.size, this.setSrc, tryNext);
            return;
        }
        if (this.state.src)
            return;
        if (this.props.name)
            this.trySetState({ value: this.getInitials(this.props.name) });
        if (!this.props.name && this.props.value)
            this.trySetState({ value: this.props.value });
        if (url === null && this.props.src) {
            this.setSrc(this.parse(this.props.src, { size: this.props.size }));
            return;
        }
    },
    getVisual: function () {
        var imageStyle = {
            maxWidth: '100%',
            width: this.props.size,
            height: this.props.size,
            borderRadius: (this.props.round ? 500 : 0)
        };
        var initialsStyle = {
            background: this.props.color || this.rndColor(),
            width: this.props.size,
            height: this.props.size,
            font: Math.floor(this.props.size / 3) + 'px/100px',
            color: this.props.fgColor,
            textAlign: 'center',
            textTransform: 'uppercase',
            borderRadius: (this.props.round ? 500 : 0),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };
        return (
        /* jshint ignore:start */
        mailspring_exports_1.React.createElement("div", { style: initialsStyle }, this.state.value)
        /* jshint ignore:end */
        );
        if (this.state.src) {
            return (
            /* jshint ignore:start */
            mailspring_exports_1.React.createElement("img", { width: this.props.size, height: this.props.size, style: imageStyle, src: this.state.src, onError: this.fetch })
            /* jshint ignore:end */
            );
        }
        else {
            return (
            /* jshint ignore:start */
            mailspring_exports_1.React.createElement("div", { style: initialsStyle }, this.state.value)
            /* jshint ignore:end */
            );
        }
    },
    render: function () {
        var hostStyle = {
            display: 'inline-block',
            width: this.props.size,
            height: this.props.size,
            borderRadius: (this.props.round ? 500 : 0)
        };
        var visual = this.getVisual();
        return (
        /* jshint ignore:start */
        mailspring_exports_1.React.createElement("div", { className: this.props.className, style: hostStyle }, visual)
        /* jshint ignore:end */
        );
    }
});
module.exports = AvatarImage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZhdGFyLWltYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2F2YXRhci1pbWFnZS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMERBQTBEO0FBRTFELFlBQVksQ0FBQzs7Ozs7QUFDYiwyREFBZ0Q7QUFDaEQsNERBQW1DO0FBQ25DLDRFQUFrRDtBQUNsRCw4Q0FBc0I7QUFDdEIsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7QUFFeEMsTUFBTSxXQUFXLEdBQUcsSUFBQSw0QkFBZ0IsRUFBQztJQUNqQyxXQUFXLEVBQUUsYUFBYTtJQUMxQixXQUFXLEVBQUU7UUFFVCxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVc7WUFDN0IsT0FBTyxRQUFRLENBQUM7UUFFcEIsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUNwQyxDQUFDO0lBRUQscUJBQXFCLENBQUMsU0FBUyxFQUFFLFNBQVM7UUFDdEMsT0FBTyxDQUFDLDBCQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQywwQkFBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BHLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxjQUFjLEVBQUUsVUFBUyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPO1FBRTdDLElBQUksSUFBSSxHQUFHLCtDQUErQyxDQUFDO1FBRTNELHVEQUF1RDtRQUN2RCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLEtBQUssR0FBRyxJQUFBLGFBQUcsRUFBQyxLQUFLLENBQUMsQ0FBQztRQUV2QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxD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