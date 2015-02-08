<h1> Piggy Plug App </h1>
This app allows users to require money from Piggy Banks in order to turn outlets on - ideal for parents with young children, 
spouses with ESPN-addicted significant others, and energy-conscious households.

<h3> First: a note on data persistence and the Wink API </h3>
<p> Data is not persistent in this app, as the Wink API has no means of storing things like Outlet Cost, or Piggy Bank deductions. A simple remedy for this would involve setting up a basic DB server using a service like Parse, to store attributes that the Wink API cannot. However, for this implementation no such solution is used, and thus all modifiable data other than Wink User is page-only. </p>

<h3> Running localhost </h3>
<p> After cloning the Git repo, the user needs to run <code> npm install </code> and <code> bower install </code>. 
If <code>npm</code> is not installed, install it using Homebrew or another system equivalent. Then localhost can be run on port 3000 with the command <code> nodemon app.js </code> from the project root directory.</p>

<h3> Directory layout and project structure </h3>
<p>The stack is comprised of NodeJS + Express + Jade + Angular. Routing is handled on the front-end by Angular-UI-Router, and 
template files are retrieved through a call to <code> /partials </code>, where Express serves the relevant Jade files. </p>

<p> The <code>/public</code> folder contains all of the compiled/minified javascript and CSS necessary for the project. SASS files are compiled from the <code>/sass</code> directory, and all CSS and JS is compiled and minified into <code>/public/css/application.min.css</code> and <code>/public/js/application.min.js</code>, respectively. To compile all of the files, run <code>grunt</code> from the project root directory.</p>

<p> The <code>/views</code> folder stores Jade templates. The main template is <code>index.jade</code>, which pulls <code> head.jade</code>, and the default Angular controller, <code> siteCtrl </code> pulls a default inner template from <code>/public/outerState/site.jade</code>, which includes the NavBar (the reason the navbar is included here, as opposed to in the universal index.jade file, is because including it here places it within the scope of siteCtrl, which allows Angular to update the navbar according to authentication state or other metrics). </p>

<p> The Angular app is contained within the <code>/public/js/angular</code> directory. The main file is <code>ngApp.js</code>, and all controllers are pulled in via UI-router from the <code>/controllers</code> directory. Services/factories are contained in the <code>/services</code> directory, and they are intended to organize API calls and hold data that persists between pages. Since this app has so few pages, and because data persistence is not prioritized, their use is minimal.</p>




