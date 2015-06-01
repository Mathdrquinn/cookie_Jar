$(document).foundation();

//function checker(match, p1, p2, p3, offset, string) {
//
//    var replacer = '';
//
//    switch (match) {
//        case '%22':
//            replacer = ': ';
//            break;
//        case '%3A':
//            replacer = '\" ';
//            break;
//        case '%5B':
//            replacer = '[';
//            break;
//        case '%7B':
//            replacer = '{';
//            break;
//        default:
//            console.log('not listed');
//    }
//    var result = [p2.slice(0,p1), p2.slice((p1 + match.length))].join(replacer);
//
//    if(result.includes(match)) {
//        return result.replace(match, checker);
//    }
//    return result;
//}
// Containing Object for all cookies
var jar = {
    list: [],
    getList: function() {
        return this.list;
    },
    getLength: function() {
        return this.getList().length;
    },
    populate: function() {
        for(var i = 0; i < this.getLength(); i++) {
            this.list[i].populate();
        }
    }
};

// Define each cookie as an object 'Crumb'
function Crumb (name, value, expiration, location, $container) {
    this.name = name;
    this.getName = function() {
        return this.name;
    };
    this.value = value;
    this.getValue = function() {
        //debugger;
        //this.value = this.value.replace('%22', checker)
        //debugger;
        //return this.value.replace('%5B', checker);
        //debugger;
        //if(this.getLocation().startsWith('.w')) {
        //    this.value = decodeURIComponent(this.value)
        //}
        return decodeURIComponent(this.value);
    };
    this.expiration = expiration || 'Unknown';
    this.getExpiration = function() {
        var clock = new Date(this.expiration);
        //return String(clock);
        return this.expiration;
    };
    this.location = location || 'I have no home.';
    this.getLocation = function() {
        if(this.location.startsWith('w')) {
            return '.' + this.locaiton;
        }
        return this.location;
    };
    this.$container = $container || 'undefined';
    this.getTmpl = function () {
        var crumb = this;
        return [
            '<div class=\'' + crumb.getLocation().slice(5,14) + ' ' + crumb.getLocation().slice(1,10) + ' row \'>',
                '<div class="column small-6 medium-3 cookie-info cookie-name">',
                    crumb.getName(),
                '</div>',
                '<div class="column small-6 medium-3 cookie-info cookie-value">',
                    crumb.getValue(),
                '</div>',
                '<div class="column small-6 medium-3 cookie-info cookie-location">',
                    crumb.getLocation(),
                '</div>',
                '<div class="column small-6 medium-3 cookie-info cookie-date">',
                    crumb.getExpiration(),
                '</div>',
                '<div class=\'clear\'></div>',
            '</div>'
        ].join('');
    };
    this.populate = function () {
        this.$container.append(this.getTmpl());
    }
}

// Getting all Cookies
var $container = $('.cookies-c-c');
chrome.cookies.getAll({}, function(cookEZ) {
    for (var prop in cookEZ) {
        //cache.add(cookies[i]);
        //removeCookie(cookies[i]);
        //$container.append('<p>' + cookEZ[prop].name + ', ' + cookEZ[prop].value + ', ' + typeof String(cookEZ[prop].expirationDate) + ', ' + cookEZ[prop].domain + '</p>');
        jar.list.push(new Crumb(cookEZ[prop].name, cookEZ[prop].value, String(cookEZ[prop].expirationDate), cookEZ[prop].domain, $container));
    }
    jar.list.sort(function (a, b) {
        if(a.getLocation().startsWith('.readers') || a.getLocation().startsWith('.www.readers') || a.getLocation().startsWith('.sunglassw') || a.getLocation().startsWith('.www.sunglass') || a.getLocation().startsWith('.felix') || a.getLocation().startsWith('.www.felix')) {
            return -1;
        }
        if (a.getLocation() > b.getLocation()) {
            return 1;
        }
        if (a.getLocation() < b.getLocation()) {
            return 1;
        }
        // a must be equal to b
        return 0;
    });
    jar.populate();
});