Module.register('MMM-pages', {
  /**
   * By default, we rotate out modules by default.
   */
  defaults: {
    numPages: 2,
    animationTime: 1000,
    rotationTime: 1000,
    rotationDelay: 10000
  },

  /**
   * Apply any styles, if we have any.
   */
  getStyles: function() {
    return ['pages.css'];
  },


  /**
   * Modulo that also works with negative numbers.
   *
   * @param {number} x The dividend
   * @param {number} n The divisor
   */
  mod: function(x, n) {
    return ((x % n) + n) % n;
  },

  /**
   * Pseudo-constructor for our module. Makes sure that values aren't negative,
   * and sets the default current page to 0.
   */
  start: function() {
    this.curPage = 0;
    this._modules = [] //Create an array empty array to fill later


    // Disable rotation if an invalid input is given
    this.config.rotationTime = Math.max(this.config.rotationTime, 0);
    this.config.rotationDelay = Math.max(this.config.rotationDelay, 0);
  },


  /**
   * Handles incoming notifications. Responds to the following:
   *   'PAGE_INCREMENT' - Move to the next page.
   *   'DOM_OBJECTS_CREATED' - Starts the module.
   *   'ALL_MODULES_STARTED'  Fires when all modules are started.
   *
   * @param {string} notification the notification ID
   * @param {number} payload the page to change to/by
   */
  notificationReceived: function(notification, payload) {
    switch (notification) {
      case 'PAGE_INCREMENT':
        Log.log('[Pages]: received a notification to increment pages!');
        this.changePageBy(payload, 1);
        this.updatePages();
        break;
      case 'DOM_OBJECTS_CREATED':
        Log.log('[Pages]: received that all objects are created;'
          + 'will now hide things!');
        break;
      case 'ALL_MODULES_STARTED':
        this._modules = MM.getModules();
        this.animatePageChange();
        this.resetTimerWithDelay(0);
        break;
      default: // Do nothing
    }
  },

  /**
   * Changes the internal page number by the specified amount. If the provided
   * amount is invalid, use the fallback amount. If the fallback amount is
   * missing or invalid, do nothing.
   *
   * @param {number} amt the amount of pages to move forward by. Accepts
   * negative numbers.
   * @param {number} fallback the fallback value to use. Accepts negative
   * numbers.
   */
  changePageBy: function(amt, fallback) {
    if (typeof amt !== 'number') {
      Log.warn(`[Pages]: ${amt} is not a number!`);
    }

    if (typeof amt === 'number' && !Number.isNaN(amt)) {
      this.curPage = this.mod(
        this.curPage + amt,
        this.config.numPages
      );
    } else if (typeof fallback === 'number') {
      this.curPage = this.mod(
        this.curPage + fallback,
        this.config.numPages
      );
    }
  },

  /**
   * Handles hiding the current page's elements and showing the next page's
   * elements.
   */
  updatePages: function() {
    // Update iff there's at least one page.
    if (this.config.numPages !== 0) {
      this.animatePageChange();
      this.resetTimerWithDelay(this.config.rotationDelay);
    } else { Log.error("[Pages]: Pages aren't properly defined!"); }
  },

  /**
   * Animates the page change from the previous page to the current one. This
   * assumes that there is a discrepancy between the page currently being shown
   * and the page that is meant to be shown.
   */
  animatePageChange: function() {
    const self = this;

    //Get all the modules that need to be shown, you filter the array by the page number.
    let modulesToShow = this._modules.filter(module => module.config.page === this.curPage)
    //Get all the modules that need to be hidden.
    let modulesToHide = this._modules.filter(module => module.config.page !== this.curPage);

    //Hide the modules in the array to hide
    modulesToHide.forEach(module => {
      module.hide(
        self.config.animationTime / 2,
        { lockString: self.identifier }
      )
    });

    // Shows all modules meant to be on the current page, after a small delay.
    setTimeout(() => {
      modulesToShow.forEach(module => {
        module.show(
          self.config.animationTime / 2,
          { lockString: self.identifier }
        )
      });
    }, this.config.animationTime / 2);
  },

  /**
   * Resets the page changing timer with a delay.
   *
   * @param {number} delay the delay, in milliseconds.
   */
  resetTimerWithDelay: function(delay) {
    if (this.config.rotationTime > 0) {
      // This timer is the auto rotate function.
      clearInterval(this.timer);
      // This is delay timer after manually updating.
      clearInterval(this.delayTimer);
      const self = this;

      this.delayTimer = setTimeout(() => {
        self.timer = setInterval(() => {
          self.sendNotification('PAGE_INCREMENT');
          self.changePageBy(1);
          self.updatePages();
        }, self.config.rotationTime);
      }, delay);
    }
  },
});
