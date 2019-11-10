var left, right;
(function() {
    var rightOpts = {
        selector: '.right svg',
        duration: '2000',
        // can pass in a function or a string like 'easeOutQuint'
        easing: function (t) { return t * t },
    };
    var leftOpts = {
        container: document.querySelector('.left'), // the dom element
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: './assets/froggie.json',
    };
    window.addEventListener('load', function() {
        anim({
            left: leftOpts,
            right: rightOpts,
        });
    });
    window.addEventListener('scroll', function() {
        anim({
            left: leftOpts,
            right: rightOpts,
        });
    });
})();

function anim(opts) {
    var leftOpts = opts['left'];
    var rightOpts = opts['right'];
    if (('undefined' == typeof right)
        || (!right)) {
        right = new Walkway(rightOpts);
    }
    if (('undefined' == typeof left)
        || (!left)) {
        left = lottie.loadAnimation(leftOpts);
        left.stop();
    }
    scrollHandler('.animations', function() {
        left.play();
        if (!document.querySelector(right.selector).classList.contains('finished')) {
            right.draw(
                function () {
                    document.querySelector(right.selector).classList.add('finished');
                }
            );
        }
    }, function() {
        left.stop();
        document.querySelector(right.selector).classList.remove('finished');
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
        var visibleBottomPart = itemCR.bottom > delta && itemCR.bottom < wH;
        var method = (visibleTopPart || visibleBottomPart) ? 'add' : 'remove';

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