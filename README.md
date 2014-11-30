dev-sms-interface
=================

A simple mock SMS interface for testing SMS services

Setup
=====

1. Install node.js (http://nodejs.org)
2. Install ionic framework <code>npm install -g cordova ionic</code>
3. Start interface <code>ionic serve</code>

Customisation
=============

The simplest way to use the dev-sms-interface for your own purposes is to implement a smsServer service.
The service exposes a single interface <code>sendSms : function(sms, responseCB)</code> and should callback with a sms object
<pre>
responseCB({
  sender : "Service",
  text : "This is a reply from the mock server",
  datetime : new Date().getTime()
})
</pre>
