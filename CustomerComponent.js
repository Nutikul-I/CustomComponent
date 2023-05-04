import React, { Component } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import "./assets/css/bootstrap.css";
import "./assets/css/style.css";

const alert = (icon, title, detail) => {
    return Swal.fire({
        icon: icon,
        title: title,
        text: detail,
        confirmButtonText: "ตกลง",
    });
};
const alert_url = (icon, title, detail, url) => {
    return Swal.fire({
        icon: icon,
        title: title,
        text: detail,
        confirmButtonText: "ตกลง",
    }).then(() => {
        window.location.href = url;
    });
};
const gen_password = (size) => {
    let result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < size; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const numberZero = (number, size) => {
    return size ?
        number.toString().padStart(size, '0') :
        number.toString().padStart(2, '0');
}
const format_date = (date, format, locale) => {
    const array_month_th = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
    const array_full_month_th = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
    let new_date = new Date(date);
    let full_date = "-";
    let day = new_date.getDate();
    let month = new_date.getMonth();
    let year = new_date.getFullYear();
    let hour = new_date.getHours();
    let minute = new_date.getMinutes();
    let secode = new_date.getSeconds();
    if (locale) {
        if (locale.toLowerCase() === "en") {
            year = new_date.getFullYear() > 2100 ? new_date.getFullYear() - 543 : new_date.getFullYear();
        } else {
            year = new_date.getFullYear() > 2100 ? new_date.getFullYear() : new_date.getFullYear() + 543;
        }
    } else {
        year = new_date.getFullYear() > 2100 ? new_date.getFullYear() : new_date.getFullYear() + 543;
    }
    if (format) {
        format = format.toLowerCase();
        // TIME
        if (format.includes("hh:mm:ss")) {
            format = format.replaceAll("hh:mm:ss", numberZero(hour) + ":" + numberZero(minute) + ":" + numberZero(secode));
        }
        if (format.includes("hh:mm")) {
            format = format.replaceAll("hh:mm", numberZero(hour) + ":" + numberZero(minute));
        }
        // DAY
        if (format.includes("dd")) {
            format = format.replaceAll("dd", numberZero(day));
        } else {
            format = format.replaceAll("d", day);
        }
        // MONTH
        if (format.includes("mmmm")) {
            format = format.replaceAll("mmmm", array_full_month_th[month]);
        } else if (format.includes("mmm")) {
            format = format.replaceAll("mmm", array_month_th[month]);
        } else if (format.includes("mm")) {
            format = format.replaceAll("mm", numberZero(month));
        } else if (format.includes("m")) {
            format = format.replaceAll("m", month);
        }
        // YEAR
        if (format.includes("yyyy")) {
            format = format.replaceAll("yyyy", numberZero(year, 4));
        } else if (format.includes("yyy")) {
            format = format.replaceAll("yyy", year.toString().slice(-2));
        } else if (format.includes("yy")) {
            format = format.replaceAll("yy", year.toString().slice(-2));
        } else if (format.includes("y")) {
            format = format.replaceAll("y", year);
        }
        full_date = format;
    } else {
        full_date = numberZero(day) + "/" + numberZero(month + 1) + "/" + numberZero(year, 4);
    }
    return full_date;
};
const toFixed = (number, size) => {
    if (number) {
        if (number === 0) {
            return "0.00"
        }
        if (size) {
            return number.toFixed(size).replace(/\d(?=(\d{3})+\.)/g, "$&,")
        } else {
            return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
        }
    } else {
        return "0.00"
    }
}
const total = (array, key) => {
    if (key) {
        return array.reduce((a, b) => a + (b[key] || 0), 0)
    } else {
        return array.reduce((a, b) => a + b, 0)
    }
}
const number = (num) => {
    return num.replace(/\D/g, "")
}
const float = (num) => {
    if (/^\d*\.?\d{0,2}$/.test(num)) {
        return true;
    }
    return false;
}

async function GET(token, url, body) {
    let promise = new Promise(async function (resolve, reject) {
        let header = {
            method: "GET",
            headers: token ? {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: token,
            } : {
                "Content-Type": "application/json",
                accept: "application/json",
            },
        }
        let text_body = "";
        if (body) {
            let array_body = Object.entries(body);
            text_body += "?";
            for (let bd of array_body) {
                text_body += bd[0] + "=";
                text_body += bd[1] + "&";
            }
            text_body = text_body.slice(0, -1);
        }
        await fetch(url + text_body, header)
            .then((result) => result.json())
            .then((result) => {
                if (result.status) {
                    resolve(result);
                } else {
                    resolve(ERROR(result));
                }
            })
            .catch((e) => {
                resolve({ status: false, message: "เกิดข้อผิดพลาด" });
            })
    });
    return promise;
}
async function POST(token, url, body) {
    let promise = new Promise(async function (resolve, reject) {
        let header = {
            method: "POST",
            headers: token ? {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: token,
            } : {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify(body)
        }
        await fetch(url, header)
            .then((result) => result.json())
            .then((result) => {
                if (result.status) {
                    resolve(result);
                } else {
                    resolve(ERROR(result));
                }
            })
            .catch((e) => {
                resolve({ status: false, message: "เกิดข้อผิดพลาด" });
            })
    });
    return promise;
}
async function PUT(token, url, body) {
    let promise = new Promise(async function (resolve, reject) {
        let header = {
            method: "PUT",
            headers: token ? {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: token,
            } : {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify(body)
        }
        await fetch(url, header)
            .then((result) => result.json())
            .then((result) => {
                if (result.status) {
                    resolve(result);
                } else {
                    resolve(ERROR(result));
                }
            })
            .catch((e) => {
                resolve({ status: false, message: "เกิดข้อผิดพลาด" });
            })
    });
    return promise;
}
async function DELETE(token, url, body) {
    let promise = new Promise(async function (resolve, reject) {
        let header = {
            method: "DELETE",
            headers: token ? {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: token,
            } : {
                "Content-Type": "application/json",
                accept: "application/json",
            }
        }
        await fetch(url, header)
            .then((result) => result.json())
            .then((result) => {
                if (result.status) {
                    resolve(result);
                } else {
                    resolve(ERROR(result));
                }
            })
            .catch((e) => {
                resolve({ status: false, message: "เกิดข้อผิดพลาด" });
            })
    });
    return promise;
}
async function ERROR(result) {
    let message = ""
    if (result.detail) {
        message = result.detail;
    } else if (result.data && !result.data.message) {
        message = result.data;
    } else if (result.data.message) {
        message = result.data.message;
    } else {
        message = result.message;
    }
    return { status: false, message: message };
}

class DatePicker extends Component {
    state = {
        value: "",
        default: new Date(),
        array_date: [],
        array_month: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
        array_year: [],
        showCalendar: false,
        min: new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
        max: new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
    };
    componentDidMount = () => {
        let year = [];
        for (let i = -100; i < 100; i++) {
            year.push(new Date().getFullYear() + i);
        }
        this.setState({ array_year: year })
        if (this.props.value) {
            this.setState({ default: new Date(this.props.value), value: new Date(this.props.value) })
        }
        if (this.props.min) {
            this.setState({ min: new Date(this.props.min) })
        }
        if (this.props.max) {
            this.setState({ max: new Date(this.props.max) })
        }
        this.getDates();
    }
    componentWillReceiveProps = (props) => {
        if (props.min) {
            this.setState({ min: new Date(props.min) })
        }
        if (props.max) {
            this.setState({ max: new Date(props.max) })
        }
        if (props.value) {
            this.setState({ default: new Date(props.value), value: new Date(props.value) })
        } else {
            this.setState({ default: new Date(), value: "" })
        }
    }
    onChangeDate = option => {
        if (option === "") {
            this.props.onChange("");
        } else {
            this.props.onChange((Number(option.getFullYear())) + "-" + (("0" + (Number(option.getMonth()) + 1)).slice(-2)) + "-" + (("0" + option.getDate()).slice(-2)));
        }
        this.setState({ value: option, showCalendar: false })
    };
    getDates = () => {
        let dates = [];
        let date = new Date(this.state.default.getFullYear(), this.state.default.getMonth(), 1);
        for (let d = 0; d < new Date(date).getDay(); d++) {
            dates.push("");
        }
        while (date.getMonth() === this.state.default.getMonth()) {
            dates.push(new Date(date).getDate());
            date.setDate(date.getDate() + 1);
        }
        this.setState({ array_date: dates })
    }
    render() {
        return (
            <div className="w-100 position-relative" style={{ minHeight: 44 }}>
                {this.state.showCalendar && (
                    <div style={{ bottom: 0, left: 0, top: 0, right: 0, backgroundColor: "#0000", zIndex: 1000, position: "fixed" }}
                        onClick={() => { this.setState({ showCalendar: false }) }}
                    ></div>
                )}
                <div className="w-100">
                    <input
                        className={this.props.className + " pointer"}
                        type="text"
                        value={this.state.value ? (("0" + this.state.value.getDate()).slice(-2)) + "/" +
                            (("0" + (Number(this.state.value.getMonth()) + 1)).slice(-2)) + "/" +
                            (Number(this.state.value.getFullYear()) + 543) : ""}
                        placeholder={this.state.placeholder ? this.state.placeholder : "dd/mm/yyyy"}
                        onFocus={() => {
                            this.setState({ showCalendar: true });
                            if (this.state.value) {
                                this.setState({ default: new Date(this.state.value) });
                                setTimeout(() => {
                                    this.getDates();
                                }, 10);
                            } else {
                                this.setState({ default: new Date() });
                                setTimeout(() => {
                                    this.getDates();
                                }, 10);
                            }
                        }}
                        disabled={this.props.disabled}
                    />
                    {this.state.showCalendar && (
                        <div className="card rounded py-2 mt-2 shadow position-absolute" style={{ zIndex: 1001, width: 300 }}>
                            <div className="d-flex justify-content-between align-items-center">
                                {this.state.default.getMonth() === 0 && this.state.default.getFullYear() === new Date().getFullYear() - 100 ? (
                                    <span className="p-3 pointer text-light"
                                    >{"<"}</span>
                                ) : (
                                    <span className="p-3 pointer"
                                        onClick={() => {
                                            let date = this.state.default;
                                            date.setMonth(date.getMonth() - 1);
                                            this.setState({ default: date });
                                            setTimeout(() => {
                                                this.getDates();
                                            }, 1);
                                        }}
                                    >{"<"}</span>
                                )}
                                {/* เดือน */}
                                <select
                                    className="border-0 text-center"
                                    style={{ width: 100 }}
                                    onChange={(e) => {
                                        let date = this.state.default;
                                        date.setMonth(e.target.value);
                                        this.setState({ default: date });
                                        setTimeout(() => {
                                            this.getDates();
                                        }, 1);
                                    }}
                                    value={this.state.default ? this.state.default.getMonth() : ""}
                                >
                                    {this.state.array_month.map((item, index) => (
                                        <option value={index}>{item}</option>
                                    ))}
                                </select>
                                <label className="mb-0 pointer mx-2">
                                    พ.ศ.</label>
                                {/* ปี */}
                                <select
                                    className="border-0 text-center"
                                    style={{ width: 60 }}
                                    onChange={(e) => {
                                        let date = this.state.default;
                                        date.setFullYear(e.target.value);
                                        this.setState({ default: date });
                                        setTimeout(() => {
                                            this.getDates();
                                        }, 1);
                                    }}
                                    value={this.state.default ? this.state.default.getFullYear() : ""}>
                                    {this.state.array_year.map((item, index) => (
                                        <option value={item}>{item + 543}</option>
                                    ))}
                                </select>
                                {this.state.default.getMonth() === 11 && this.state.default.getFullYear() === new Date().getFullYear() + 99 ? (
                                    <span className="p-3 pointer text-light"
                                    >{">"}</span>
                                ) : (
                                    <span className="p-3 pointer"
                                        onClick={() => {
                                            let date = this.state.default;
                                            date.setMonth(date.getMonth() + 1);
                                            this.setState({ default: date });
                                            setTimeout(() => {
                                                this.getDates();
                                            }, 1);
                                        }}
                                    >{">"}</span>
                                )}
                            </div>
                            <div className="w-100 d-flex row mx-0">
                                <div className="py-1 text-center" style={{ width: "14.28%" }}> อา. </div>
                                <div className="py-1 text-center" style={{ width: "14.28%" }}> จ. </div>
                                <div className="py-1 text-center" style={{ width: "14.28%" }}> อ. </div>
                                <div className="py-1 text-center" style={{ width: "14.28%" }}> พ. </div>
                                <div className="py-1 text-center" style={{ width: "14.28%" }}> พฤ. </div>
                                <div className="py-1 text-center" style={{ width: "14.28%" }}> ศ. </div>
                                <div className="py-1 text-center" style={{ width: "14.28%" }}> ส. </div>
                            </div>
                            <div className="w-100 d-flex row mx-0" style={{ height: 220 }}>
                                {this.state.array_date.map((item, index) => (
                                    <div
                                        className={this.state.value &&
                                            item &&
                                            (this.state.value.getDate() === item) &&
                                            (this.state.value.getMonth() === this.state.default.getMonth()) &&
                                            (this.state.value.getFullYear() === this.state.default.getFullYear()) ?
                                            (new Date(this.state.default.getFullYear(), this.state.default.getMonth(), item) > this.state.min.getTime()) &&
                                                (new Date(this.state.default.getFullYear(), this.state.default.getMonth(), item) < this.state.max.getTime()) ?
                                                "py-1 text-center bg-primary d-flex align-items-center justify-content-center text-white pointer" :
                                                "py-1 text-center bg-primary d-flex align-items-center justify-content-center text-light" :
                                            (new Date(this.state.default.getFullYear(), this.state.default.getMonth(), item) > this.state.min.getTime()) &&
                                                (new Date(this.state.default.getFullYear(), this.state.default.getMonth(), item) < this.state.max.getTime()) ?
                                                "py-1 text-center d-flex align-items-center justify-content-center pointer" :
                                                "py-1 text-center d-flex align-items-center justify-content-center text-light"}
                                        style={{ width: "14.28%" }}
                                        onClick={() => {
                                            if ((new Date(this.state.default.getFullYear(), this.state.default.getMonth(), item) > this.state.min.getTime()) &&
                                                (new Date(this.state.default.getFullYear(), this.state.default.getMonth(), item) < this.state.max.getTime())) {
                                                this.onChangeDate(new Date(this.state.default.getFullYear(), this.state.default.getMonth(), item))
                                            }
                                        }}>

                                        {item}
                                    </div>
                                ))}
                            </div>
                            <div className="d-flex justify-content-between px-2">
                                <label className="text-primary pointer" onClick={() => { this.onChangeDate("") }}>clear</label>
                                <label className="text-primary pointer" onClick={() => { this.onChangeDate(new Date()) }}>To day</label>
                            </div>
                        </div>
                    )}
                </div>
            </div >
        );
    }
}
class Icon extends Component {
    state = {};
    componentDidMount = () => { }
    render() {
        return (
            <span
                className={
                    "icon-light" +
                    (this.props.color ? " text-" + this.props.color : " text-dark") +
                    (this.props.className ? " " + this.props.className : "")
                }
                style={{ fontSize: (this.props.size ? this.props.size : 16) }}
            >{this.props.icon}</span>
        );
    }
}
class Select extends Component {
    state = {};
    componentDidMount = () => { }
    render() {
        return (
            <Select
                className={this.props.className ? this.props.className : ""}
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        height: 44,
                        padding: 0,
                        border: 0,
                        backgroundColor: "#00000000"
                    }),
                    valueContainer: (baseStyles, state) => ({
                        ...baseStyles,
                        height: 44,
                        paddingTop: 0,
                        paddingLeft: 12,
                        paddingBottom: 0,
                        paddingRight: 12,
                    }),
                    input: (baseStyles, state) => ({
                        ...baseStyles,
                        height: 44,
                        padding: 0,
                        margin: 0
                    }),
                }}
                options={this.props.options ? this.props.options : ""}
                onChange={this.props.onChange ? this.props.onChange : (e) => { }}
                value={this.props.value ? this.props.value : null}
            ></Select>
        );
    }
}

export {
    alert,
    alert_url,
    gen_password,
    numberZero,
    format_date,
    toFixed,
    total,
    number,
    float,

    GET,
    POST,
    PUT,
    DELETE,
    ERROR,

    DatePicker,
    Icon,
    Select,
};