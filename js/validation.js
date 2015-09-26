(function(w, d) {
    var allFields = '';

    var checkMail = function(m) {
        return (new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i).test(m))
    };

    var checkPhone = function(p) {
        return (new RegExp(/^([\+]+)*[0-9\x20\x28\x29\-]{5,20}$/).test(p))
    };

    var checkText = function(p) {
        return (new RegExp(/(^\s+|\s+$)/g).test(p))
    };

    var regVar = function(p) {
        return new RegExp('(^|\\s)' + p + '(\\s|$)', 'g')
    };

    var addClassName = function(e, name) {
        if (nullUndElem(e)) {
            if (e.classList !== undefined) e.classList.add(name);
            else {
                if (!regVar(name).test(e.className)) e.className += ' ' + name
            }
        }
    };

    var remClassName = function(e, name) {
        if (nullUndElem(e)) {
            if (e.classList !== undefined) e.classList.remove(name);
            else {
                if (regVar(name).test(e.className)) e.className = e.className.replace(regVar(name), ' ')
            }
        }
    };

    var nullUndElem = function(e) {
        return e !== null || e !== undefined
    };

    var checkFields = function(c, obj, allm, result, check, check2) {
        if (nullUndElem(allm[1])) {
            if (typeof allm[2] !== 'function' && allm[2] === false) {
                if (check2) result.push([allm[0], allm[1].value])
            } else {
                if (check) {
                    if (allm[2] !== undefined && typeof allm[2] === 'function') allm[2](allm[1]);
                    else if (obj.startError !== undefined && typeof obj.startError === 'function') obj.startError(allm[1]);
                    else allFields += allm[0] + ' ';
                    addClassName(allm[1], c)
                } else {
                    if (allm[3] !== undefined && typeof allm[3] === 'function') allm[3](allm[1]);
                    else if (obj.endError !== undefined && typeof obj.endError === 'function') obj.endError(allm[1]);
                    remClassName(allm[1], c);
                    result.push([allm[0], allm[1].value])
                }
            }
        }
    };
    w._validation = {
        start: function(obj) {
            if (nullUndElem(obj.form))
            obj.form.onsubmit = function() {
                var result = [],
                    i, c = 'mjs-no-send';
                for (i = 0; i < obj.checkElems.length; i++) {
                    var allm = obj.checkElems[i];
                    if (allm !== undefined) {
                        switch (allm[0]) {
                            case 'phone':
                                checkFields(c, obj, allm, result, !checkPhone(allm[1].value), checkPhone(allm[1].value));
                                break;
                            case 'email':
                                checkFields(c, obj, allm, result, !checkMail(allm[1].value), checkMail(allm[1].value));
                                break;
                            case 'text':
                                checkFields(c, obj, allm, result, allm[1].value.length < 3 || checkText(allm[1].value), allm[1].value.length > 3 || checkText(allm[1].value));
                                break;
                            case 'select':
                                checkFields(c, obj, allm, result, allm[1].value === '');
                                break;
                            case 'radio':
                                if (allm[1].checked === true) result.push([allm[0], allm[1].value]);
                                break;
                            case 'checkbox':
                                checkFields(c, obj, allm, result, allm[1].checked !== true, allm[1].checked === true);
                                break;
                            default:
                                console.warn('not type: "' + allm[0] + '"')
                        }
                    }
                }
                var allFieldsError = d.getElementsByClassName(c).length;
                if (obj.startError === undefined) alert('error fields: ' + allFields);
                if (obj.sendData !== undefined) {
                    if (allFieldsError <= 0) obj.sendData(result);
                    return false
                } else if (allFieldsError !== 0) return false
            }
        }
    }
})(window, document);
