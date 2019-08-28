
# MMM-pages

This [MagicMirror²][mm] Module is a fork of the Original [MMM-Pages][pages] module by Edward Shen.
This module allows you to have pages in your magic mirror! You can specify which modules are on what page.
This allows you to have pages with different modules, for example let's say you wanted the current weather
and forcast to be on the same page and then on another page you wanted the same modules but for a different locations.
I made the modificiations to the original because I needed this specific scenario and didn't find an alternative.

![](mmm-pages.gif)

## Installation

In your terminal, go to your MagicMirror's Module folder:

```bash
cd ~/MagicMirror/modules
```
Clone this repository:
```bash
git clone https://github.com/rfoltz/MMM-pages.git
```
Configure the module in your config.js file.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file. You also need to add a `page:` key to every module you would like on a page. For exmaple below if I wanted the clock module on the first page I would put it on page 0.
```js
modules: [
    {
        module: 'MMM-pages',
        config: {
            numPages: 3,
            rotationTime: 1000
        }
    },
    {
        module: "clock",
        position: "middle_center",
        config: {
            showDate: true,
            page: 0
        }
    }

]
```

## Configuration options

| Option          | Type               | Default Value            | Description |
| --------------- | ------------------ | ------------------------ | ----------- |
| `animationTime` | `int`              | `1000`                   | Fading animation time. Set to `0` for instant change. Value is in milliseconds (1 second = 1000 milliseconds). |
| `rotationTime`  | `int`              | `1000`                      | Time, in milliseconds, between automatic page changes. |
| `delayTime`     | `int`              | `1000`                      | Time, in milliseconds, of how long should a manual page change linger before returning to automatic page changing. In other words, how long should the timer wait for after you manually change a page. This does include the animation time, so you may wish to increase it by a few seconds or so to account for the animation time. |

Don't forget to add the `page:` key to the modules you would like to display like in the example above.


## FAQ

- Help! My module is (above/below) another module in the same region but I want
  it to be somewhere else!

  The order of your `config.js` determines your module location. If you have two
  modules, both with `position:bottom_bar`, the one that is first listed will
  appear on top. The rest will appear in the same order you defined them in. If
  you want this module to be at the very bottom, define this module as the last
  module in your `config.js` file. If you want it to be on top in that region,
  make sure no other module is defined before it that has the same region.

- Can I make a pull request?

  Please do! Feel free; I love improvements!

- I want more config options!

  Please make an issue. Thanks!

[mm]: https://github.com/MichMich/MagicMirror
[pages]: https://github.com/edward-shen/MMM-pages
