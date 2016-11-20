'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactClickdrag = require('react-clickdrag');

var _reactClickdrag2 = _interopRequireDefault(_reactClickdrag);

var _clamp = require('clamp');

var _clamp2 = _interopRequireDefault(_clamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KEYS = {
    UP: 38,
    DOWN: 40,
    ENTER: 13,
    BACKSPACE: 8
};

var ALLOWED_KEYS = [8, // Backspace
9, // Tab
35, // End
36, // Home
37, // Left Arrow
39, // Right Arrow
46, // Delete
48, 49, 50, 51, 52, 53, 54, 55, 56, 57, // 0 - 9
190, // (Dot)
189, 173, // (Minus) - [Multiple values across different browsers]
96, 97, 98, 99, 100, 101, 102, 103, 104, 105, // Numpad 0-9
109, // Numpad - (Minus)
110 // Numpad . (Decimal point)
];

var propTypes = {
    className: _react.PropTypes.string,
    decimals: _react.PropTypes.number,
    max: _react.PropTypes.number,
    min: _react.PropTypes.number,
    onValueChange: _react.PropTypes.func,
    step: _react.PropTypes.number,
    stepModifier: _react.PropTypes.number,
    style: _react.PropTypes.object,
    value: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]).isRequired,
    onKeyDown: _react.PropTypes.func
};

var defaultProps = {
    className: '',
    decimals: 0,
    max: Number.MAX_VALUE,
    min: -Number.MAX_VALUE,
    onValueChange: function onValueChange() {
        // do nothing
    },
    step: 1,
    stepModifier: 10,
    style: {}
};

var NumberEditor = function (_React$Component) {
    _inherits(NumberEditor, _React$Component);

    function NumberEditor(props) {
        _classCallCheck(this, NumberEditor);

        var _this = _possibleConstructorReturn(this, (NumberEditor.__proto__ || Object.getPrototypeOf(NumberEditor)).call(this, props));

        _this.onKeyDown = _this.onKeyDown.bind(_this);
        _this.onDoubleClick = _this.onDoubleClick.bind(_this);
        _this.onChange = _this.onChange.bind(_this);
        _this.onBlur = _this.onBlur.bind(_this);
        _this.onFocus = _this.onFocus.bind(_this);

        _this.state = {
            startEditing: false,
            wasUsingSpecialKeys: false,
            dragStartValue: Number(props.value)
        };
        return _this;
    }

    _createClass(NumberEditor, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            // start
            if (nextProps.dataDrag.isMouseDown && !nextProps.dataDrag.isMoving) {
                this.setState({
                    dragStartValue: Number(this.props.value)
                });
            }

            if (nextProps.dataDrag.isMoving) {
                var step = this.getStepValue(nextProps.dataDrag, this.props.step);
                this.changeValue(this.state.dragStartValue + nextProps.dataDrag.moveDeltaX * (step / 2));
            }
        }
    }, {
        key: 'onDoubleClick',
        value: function onDoubleClick() {
            this.setState({
                startEditing: true
            });
        }
    }, {
        key: 'onChange',
        value: function onChange(e) {
            this.props.onValueChange(e.target.value);
        }
    }, {
        key: 'onFocus',
        value: function onFocus(e) {
            this.setState({
                startEditing: true
            });
        }
    }, {
        key: 'onBlur',
        value: function onBlur(e) {
            this.changeValue(Number(e.target.value).toFixed(this.props.decimals));
            this.setState({
                startEditing: false
            });
        }
    }, {
        key: 'onKeyDown',
        value: function onKeyDown(e) {
            var step = this.getStepValue(e, this.props.step);

            var value = Number(this.props.value);
            var key = e.which;

            if (key === KEYS.UP) {
                e.preventDefault();
                this.changeValue(value + step);
            } else if (key === KEYS.DOWN) {
                e.preventDefault();
                this.changeValue(value - step);
            } else if (key === KEYS.ENTER) {
                e.preventDefault();
                if (this.state.startEditing) {
                    // stop editing + save value
                    this.onBlur(e);
                } else {
                    this.setState({
                        startEditing: true
                    });
                    e.target.select();
                }
            } else if (key === KEYS.BACKSPACE && !this.state.startEditing) {
                e.preventDefault();
            } else if (ALLOWED_KEYS.indexOf(key) === -1) {
                // Suppress any key we are not allowing.
                e.preventDefault();
            }

            if (this.props.onKeyDown) {
                this.props.onKeyDown(e);
            }
        }
    }, {
        key: 'getStepValue',
        value: function getStepValue(e, step) {
            var newStep = step;
            if (e.metaKey || e.ctrlKey) {
                newStep /= this.props.stepModifier;
            } else if (e.shiftKey) {
                newStep *= this.props.stepModifier;
            }

            return newStep;
        }
    }, {
        key: 'changeValue',
        value: function changeValue(value) {
            var newVal = (0, _clamp2.default)(Number(value).toFixed(this.props.decimals), this.props.min, this.props.max);

            newVal = Number(newVal).toFixed(this.props.decimals);
            this.props.onValueChange(newVal);
        }
    }, {
        key: 'render',
        value: function render() {
            var cursor = 'ew-resize';
            var readOnly = true;
            var value = this.props.value;
            // If we have a zero we actually want to display it as an empty
            // string so we don't have to delete '0' before typing.
            if (value === 0) {
                value = "";
            }
            if (this.state.startEditing) {
                cursor = 'auto';
                readOnly = false;
                // If the string starts with a decimal point, pre-pend a
                // zero.  This keeps it as a valid number so that TABing
                // will correctly highlight the value.
                if (value.toString().charAt(0) == '.') {
                    value = "0" + value;
                }
            }

            if (!this.state.startEditing) {
                value = Number(value).toFixed(this.props.decimals);
            }

            return _react2.default.createElement('input', {
                type: 'text',
                className: this.props.className,
                readOnly: readOnly,
                value: value,
                style: _extends({}, this.props.style, { cursor: cursor }),
                onKeyDown: this.onKeyDown,
                onDoubleClick: this.onDoubleClick,
                onChange: this.onChange,
                onBlur: this.onBlur,
                onFocus: this.onFocus
            });
        }
    }]);

    return NumberEditor;
}(_react2.default.Component);

NumberEditor.propTypes = propTypes;
NumberEditor.defaultProps = defaultProps;

exports.default = (0, _reactClickdrag2.default)(NumberEditor, {
    resetOnSpecialKeys: true,
    touch: true,
    getSpecificEventData: function getSpecificEventData(e) {
        return {
            metaKey: e.metaKey,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey
        };
    },
    onDragMove: function onDragMove(e) {
        e.preventDefault();
    }
});