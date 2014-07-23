
'use strict'

$(document).ready( () ->
  window.app = {}
  $('.nav [href="' + window.location.pathname + '"]').closest('li').toggleClass('active')

  $(document).ajaxStart( () -> $('.ajax-spinner').show(); )
  $(document).ajaxStop(() -> $('.ajax-spinner').hide(); )

  $(document).bind('mousemove', (e) ->
    $('.ajax-spinner').css({
      left: e.pageX + 15,
      top: e.pageY
    })
  )
)
