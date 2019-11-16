var left, right;
(function() {
    var rightOpts = {
        selector: '.walkway-animation svg',
        duration: '1000',
        // can pass in a function or a string like 'easeOutQuint'
        easing: 'easeInQuad',
    };
    var leftOpts = {
        container: document.querySelector('.lottie-animation'), // the dom element
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: './assets/froggie.json',
    };
    var config = {
        parent: 'animations',
        left: leftOpts,
        right: rightOpts,
    };
    config['right']['selector'] = '.' + config.parent + ' ' + rightOpts['selector'];
    window.addEventListener('load', function() {
        anim(config);
    });
    window.addEventListener('scroll', function() {
        anim(config);
    });
})();

function anim(opts) {
    var parentClassName = '.animations';
    var leftOpts = opts['left'];
    var rightOpts = opts['right'];
    if ('parent' in opts) {
        parentClassName = '.' + opts['parent'];
    }
    if (('undefined' == typeof right)
        || (!right)) {
        right = new Walkway(rightOpts);
    }
    if (('undefined' == typeof left)
        || (!left)) {
        left = lottie.loadAnimation(leftOpts);
        left.stop();
    }
    scrollHandler(parentClassName, function() {
        left.play();
        if (!document.querySelector(right.selector).parentNode.classList.contains('finished')) {
            right.draw(
                function () {
                    document.querySelector(right.selector).parentNode.classList.add('finished');
                }
            );
        }
    }, function() {
        left.stop();
        document.querySelector(right.selector).parentNode.classList.remove('finished');
        right = new Walkway(rightOpts);
    });
}

function scrollHandler(selector, enterHandler, leaveHandler, options) {
    if (arguments.length < 4) {
        options = {}
    };
    var flagClass = 'shown';
    var delta = 0;
    var collection = document.querySelectorAll(selector);
    if (!(collection && collection.length)) return;

    if ('flagClass' in options) {
        flagClass = options['flagClass'];
    }
    if ('delta' in options) {
        delta = options['delta'];
    }

    var wH = window.innerHeight;
    Array.prototype.forEach.call(collection, function(i) {
        var itemCR = i.getBoundingClientRect();
        var visibleTopPart =  itemCR.top > delta && itemCR.top < wH;
        var visibleCenterPart = itemCR.top <= delta && itemCR.bottom >= delta;
        var visibleBottomPart = itemCR.bottom > delta && itemCR.bottom < wH;

        var method = (visibleTopPart || visibleBottomPart || visibleCenterPart) ? 'add' : 'remove';
        i.classList[method](flagClass);

        if (i.classList.contains(flagClass)) {
            if ('function' == typeof enterHandler) {
                enterHandler();
            }
            return;
        }

        if ('function' == typeof leaveHandler) {
            leaveHandler();
        }
        return;
    });
}