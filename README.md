node-jobqueue
=============

An extremely simple job queue over HTTP.

Philosophy
----------

For most projects, a full queuing system is overkill. You already have web app code that does what you need, but 
you want to run it out-of-band. And you don't want a separate process or class of boxes running your jobs.

So, this code allows you to request that an HTTP endpoint be run later, without concern for how long it takes.

How to use
----------

1. Copy `config.template.js` to `config.js` and edit the values
1. Start the server somehow
1. When you want to defer a task, `POST` to your `listen_host`. We suggest JSON bodies.
1. Make sure you are listening at `queue_endpoint`. Dispatch jobs as necessary.
