/*!
 * jCarousel Control Plugin v@VERSION
 * http://sorgalla.com/jcarousel/
 *
 * Copyright 2011, Jan Sorgalla
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * or GPL Version 2 (http://www.opensource.org/licenses/gpl-2.0.php) licenses.
 *
 * Date: @DATE
 */
jCarousel.plugin('control', function($) {
    var jCarousel = this;

    return {
        options: {
            target: '+=1',
            event:  'click'
        },
        enabled: null,
        _init: function() {
            this.carousel()
                ._bind('reloadend.' + this.pluginName, jCarousel.proxy(this.reload, this))
                ._bind('scrollend.' + this.pluginName, jCarousel.proxy(this.reload, this));

            this.element()
                .bind(this.option('event') + '.' + this.pluginName, jCarousel.proxy(function(e) {
                    e.preventDefault();
                    if (this.enabled) {
                        this.carousel().scroll(this.option('target'));
                    }
                }, this));

            this.reload();
        },
        _destroy: function() {
            this.element()
                .removeClass(this.pluginClass + '-enabled')
                .removeClass(this.pluginClass + '-disabled');
        },
        reload: function() {
            var parsed = jCarousel.parseTarget(this.option('target')),
                carousel = this.carousel(),
                enabled;

            if (parsed.relative) {
                enabled = carousel[parsed.target > 0 ? 'hasNext' : 'hasPrev']();
            } else {
                var target = typeof parsed.target !== 'object' ?
                                 carousel.items().eq(parsed.target) :
                                 parsed.target;

                enabled = carousel.fullyvisible().index(target) < 0;
            }

            if (this.enabled === enabled) {
                return this;
            }

            if (enabled) {
                this.element()
                    .addClass(this.pluginClass + '-enabled')
                    .removeClass(this.pluginClass + '-disabled');
            } else {
                this.element()
                    .removeClass(this.pluginClass + '-enabled')
                    .addClass(this.pluginClass + '-disabled');
            }

            this._trigger(enabled ? 'enabled' : 'disabled');

            this.enabled = enabled;

            return this;
        }
    };
});
