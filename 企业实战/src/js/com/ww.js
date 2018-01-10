! function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? (module.exports = factory()) :
    typeof define === 'function' && define.amd ? define(factory) : (global.Swiper = factory())
}(this, function () {

  function Swiper(options) {
    this.parentNode = document.querySelector(options.parentNode)
    this.imageData = options.imageData
    this.style = {}
    this.style.width = options.width || 960
    this.style.height = options.height || 540
    this.currentIndex = options.currentIndex || 0
    this.speed = options.speed || 1000
    this.unit = 'px'
    this.length = this.imageData.length
    this.autoTimer = null
    this.interval = options.interval || 3000
    this.auto = options.auto || false
    this.style.width = parseFloat(getComputedStyle(this.parentNode).width)
    this.init()
    this.adjustWidht()
  }

  Swiper.prototype.init = function () {
    this.renderSwiper()
    this.getMiddleButtonLi()
    this.toggleMiddleButtonActive()
    if (this.auto) {
      this.autoMove()
    }
  }

  Swiper.prototype.adjustWidht = function () {
    var timer
    var self = this
    window.addEventListener('resize', function (e) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        self.parentNode.innerHTML = ''
        self.style.width = parseFloat(getComputedStyle(self.parentNode).width)
        self.init()
      }, 300)
    })
  }

  Swiper.prototype.getMiddleButtonLi = function () {
    this.swiperMiddleButton = document.querySelectorAll('._swiper-btn')
    this.handleMiddleButtonClick()
  }

  Swiper.prototype.checkAuto = function () {
    if (this.auto) {
      this.autoMove()
    }
  }

  Swiper.prototype.autoMove = function () {
    var self = this
    clearInterval(this.autoTimer)
    this.autoTimer = setInterval(function () {
      self.calculatePosition(1)
      self.move()
    }, this.interval)
  }

  Swiper.prototype.handleMiddleButtonClick = function () {
    var self = this
    for (var i = 0; i < this.swiperMiddleButton.length; i++) {
      this.swiperMiddleButton[i].addEventListener('click', function (e) {
        clearInterval(self.autoTimer)
        var index = self.indexOfMiddleButton(this)
        if (index > -1) {
          self.move()
          self.checkAuto()
        }
      }, true)
    }
  }

  Swiper.prototype.indexOfMiddleButton = function (node) {
    if (this.swiperMiddleButton.length < 1) {
      return -1
    }
    for (var i = 0; i < this.swiperMiddleButton.length; i++) {
      if (this.swiperMiddleButton[i] === node) {
        this.currentIndex = i
        this.nextIndex = i
        return i
      }
    }
    return -1
  }

  Swiper.prototype.toggleMiddleButtonActive = function () {
    for (var i = 0; i < this.swiperMiddleButton.length; i++) {
      this.swiperMiddleButton[i].style.backgroundColor = '#fff'
    }
    this.swiperMiddleButton[this.currentIndex].style.backgroundColor = '#FF9999'
  }

  Swiper.prototype.handleButtonClick = function (node, sign) {
    var self = this
    node.addEventListener('click', function (e) {
      clearInterval(self.autoTimer)
      self.calculatePosition(sign)
      self.move()
      self.checkAuto()
    }, true)
  }

  Swiper.prototype.calculatePosition = function (sign) {
    this.nextIndex = this.currentIndex + sign
    if (this.nextIndex < 0) {
      this.nextIndex = this.length * 1 - 1
    } else if (this.nextIndex >= this.length) {
      this.nextIndex = 0
    }
    this.currentIndex = this.nextIndex
  }

  Swiper.prototype.move = function () {
    this.swiperContent.style.left = -this.nextIndex * this.style.width + this.unit
    this.toggleMiddleButtonActive()
  }

  Swiper.prototype.renderSwiper = function () {
    this.swiperWrap = this.createWarp()
    this.parentNode.appendChild(this.swiperWrap)
  }

  Swiper.prototype.createWarp = function () {
    var div = document.createElement('div')
    div.style.position = 'relative'
    div.style.width = this.style.width + this.unit
    div.style.height = this.style.height + this.unit
    div.style.overflow = 'hidden'
    div.style.margin = '0 auto'

    div.appendChild(this.createUl())
    div.appendChild(this.leftButton())
    div.appendChild(this.rightButton())
    div.appendChild(this.createMiddleButton())
    return div
  }

  Swiper.prototype.createMiddleButton = function () {
    var ul = document.createElement('ul')
    ul.style.listStyle = 'none'
    ul.style.padding = 0
    ul.style.margin = 0
    ul.style.position = 'absolute'
    ul.style.bottom = '20px'
    ul.style.left = '50%'
    ul.style.transform = 'translateX(-50%)'

    var lis = ''
    for (var i = 0; i < this.length; i++) {
      lis += '<li class="_swiper-btn" style="width:45px;height:5px;background-color:#fff;border-radius:2px;display:inline-block;margin:0 4px;cursor:pointer"></li>'
    }

    ul.innerHTML = lis
    return ul
  }

  Swiper.prototype.leftButton = function () {
    var div = this.createButon()
    div.style.left = '20px'
    var arrow = this.createArrow()
    arrow.style.transform = 'rotate(-135deg) translate(15%, -15%)'
    div.appendChild(arrow)
    this.handleButtonClick(div, -1)
    return div
  }

  Swiper.prototype.rightButton = function () {
    var div = this.createButon()
    div.style.right = '20px'
    var arrow = this.createArrow()
    arrow.style.transform = 'rotate(45deg) translate(-50%,50%)'
    div.appendChild(arrow)
    this.handleButtonClick(div, 1)
    return div
  }

  Swiper.prototype.createArrow = function () {
    var div = document.createElement('div')
    div.style.borderWidth = '4px'
    div.style.borderStyle = 'solid'
    div.style.borderColor = '#ccc #ccc transparent transparent'
    div.style.position = 'absolute'
    div.style.top = '30%'
    div.style.left = '50%'
    div.style.width = '15px'
    div.style.height = '15px'
    div.style.backgroundColor = 'transparent'
    return div
  }

  Swiper.prototype.createButon = function () {
    var div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.top = '50%'
    div.style.width = '40px'
    div.style.height = '60px'
    div.style.marginTop = -parseFloat(div.style.height) * 0.5 + 'px'
    div.style.backgroundColor = 'rgba(0,0,0,.6)'
    div.style.cursor = 'pointer'
    return div
  }

  Swiper.prototype.createUl = function () {
    var ul = document.createElement('ul')
    ul.style.width = this.length * this.style.width + this.unit
    ul.style.height = this.style.height + this.unit
    ul.style.overflow = 'hidden'
    ul.style.listStyle = 'none'
    ul.style.position = 'absolute'
    ul.style.left = 0
    ul.style.top = 0
    ul.style.padding = 0
    ul.style.margin = 0
    ul.style.transition = `all ${this.speed}ms`

    var lis = this.handleImageData()
    ul.innerHTML = lis
    this.swiperContent = ul
    return ul
  }

  Swiper.prototype.handleImageData = function () {
    if (this.imageData.length < 1) {
      return
    }

    var lis = ''
    for (var i = 0; i < this.imageData.length; i++) {
      lis += this.createLi(this.imageData[i])
    }

    return lis
  }

  Swiper.prototype.createLi = function (data) {
    if (!data) {
      return
    }

    var li = `
      <li style="width:${this.style.width + this.unit};height:100%;float:left;">
        <a style="display:block;width:100%;height:100%" target="_blank" href="${data.link || 'javascript:;'}">
          <img style="width:100%;height:100%;vertical-align:top;" src="${data.url}" alt="图片">
        </a>
      </li>
      `
    return li
  }

  return Swiper
})