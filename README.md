Cumin Monitor
===

A monitoring tool for queues that have been created with the [cumin library](https://github.com/errorception/cumin).

Lets you monitor queue activity: when were items last added and removed from queues, and what is the number of items currently in the queue.

![Cumin Monitor Screenshot](https://raw.github.com/errorception/cumin-monitor/master/screen.png)

## Installation

Install qmin-monitor via git:

```
git clone https://github.com/errorception/cumin-monitor.git
cd cumin-monitor
npm install
```

## Running the app

To run the monitoring app, simply ```cd``` to the ```cumin-monitor``` directory, and run:

    $ node cumin-monitor.js

You will be able to view the monitoring UI at ```http://localhost:1337/```

## License

(The MIT License)

Copyright (c) 2012 Rakesh Pai <rakeshpai@errorception.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
