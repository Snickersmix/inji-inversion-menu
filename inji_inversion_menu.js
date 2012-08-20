/**
 * Меню с плавной инверсией цвета
 *
 * @author Alexey Krupsky <benzus@mail.ru>
 */
jQuery.fn.inji_inversion_menu = function(options) {
    // настройки по умолчанию
    var options = jQuery.extend({
      bg: '#000', // бэкграунд
      font: '#fff', // цвет шрифта
      activeclass: 'active', //класс активного элемента
      cloneclass: 'inji_inversion_menu_clone', // класс клона меню
      navcursorclass: 'inji_inversion_menu_navcursor', // класс курсора
      speed: 500 // скорость курсора в миллисекундах
    },options);
    return this.each(function() {
        var menu = jQuery(this);
        if( menu.length <= 0)
            return;
        var timeout = null;
        var start = {};
        menu.wrap( '<div style = "position:relative"></div>' );
        if( menu.find( '.' + options.activeclass ).length > 0 ) {
            var current = menu.find( '.' + options.activeclass );
            current.removeClass( options.activeclass );

            start.left = current.position().left;
            start.top = current.position().top;
            start.height = current.height();
            start.width = current.width() + parseInt( current.css( 'paddingLeft' ) ) + parseInt( current.css( 'paddingRight' ) );
        }
        else {
            obj = menu.find( ':first-child' );
            start.left = obj.position().left;
            start.top = obj.position().top;
            start.height = obj.height();
            start.width = 0;
        }

        var position = current;
        menu.parent().append( '<div class = "' + options.navcursorclass + '"></div>' );
        var navcursor =  menu.parent().find( '.' + options.navcursorclass );

        navcursor.css( { 'marginTop':-menu.height()+start.top, 'width':start.width, 'height':start.height, 'marginLeft':start.left, 'overflow':'hidden',  'whiteSpace':'nowrap', 'position':'absolute' } );

        var clone = menu.clone();
        clone.css( { 'marginLeft':-start.left, 'marginTop':- start.top, 'background':options.bg, 'width':menu.width() } );
        clone.find( 'a' ).css( 'color', options.font );
        clone.addClass( options.cloneclass );
        clone = clone.appendTo( navcursor );

        clone.children().hover( function() {
            clearTimeout(timeout);
        },
        navcursorback );
        menu.children().hover( function() {
            clearTimeout(timeout);
            if(  jQuery(this) == current )
                return;

            current = this;
            navcursor.stop().animate({
                                'marginLeft':jQuery(this).position().left,
                                'marginTop':jQuery(this).position().top-menu.height(),
                                'width':jQuery(this).width() + parseInt( jQuery(this).css( 'paddingLeft' ) ) + parseInt ( jQuery(this).css( 'paddingRight' ) )
                            },
                            {
                                duration:options.speed,
                                step: function(){
                                    clone.css( { 'marginLeft':'-' + navcursor.css('marginLeft'), 'marginTop':-( menu.height() + parseFloat( navcursor.css('marginTop') ) ) } );
                                }
                            });
        },
        navcursorback );
        function navcursorback() {
            clearTimeout(timeout);
            timeout = setTimeout(function(){
            current = position;
            navcursor.stop(true).animate({
                                'marginLeft':start.left,
                                'marginTop':start.top-menu.height(),
                                'width':start.width
                            },
                            {
                                duration:options.speed,
                                step: function(){
                                    clone.css( { 'marginLeft':'-'+navcursor.css('marginLeft'), 'marginTop':-( menu.height() + parseFloat( navcursor.css('marginTop') ) ) } );
                                }
                            });
            },100);
        }
    });
}