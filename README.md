
![logo](https://github.com/thatgirlAm/projetTest/assets/117035426/b8456bef-ba00-42f7-bd79-f81829f6f009)

## TRANSEN : a banking application.

This project is part of the initiation for Laravel and Angular : so it's pretty much a test. 
I've had to make a full page single page application with security features implemented to mimic the functionning of a real application.

## <i>"Why do they call it the 'back of the store'? That's where your money disappears!"</i> : Back-End - Laravel 11.

For this project I've had to use <a href="https://laravel.com/docs/11.x/releases">Laravel 11</a> to implement my back-end features : it was about setting the database up, seeding them with false data, 
and setting the rules up for data registration. 
We've had to use Apis and ApiResource (testing everything with <a href="https://www.postman.com">Postman</a>) with CRUD methods.

### <i>"Enter every place like you own it—unless it's a jail."</i> : The data entering the database.
<ol>
<li>Data in this project has been managed meticulously in order to obtain the most secure app in the end. As a matter of fact, securing the system implied using data <strong>requests</strong> to impose the type,
if it is required, the format etc. Also, the methods have manual validation steps to insure all the requierements are met (example : checking if a phone number already exist before accepting the registration).</li>

<li>For the format of the data (important for returned data manipulation and insecure if not managed), we used resources to make sure only the needed information are sent to the Api request. 

</ol>


### <i>"What goes around, comes aroud"</i> : Api Routes

For routes, we used Apis. We managed access of the user through guards, Middleware and secured the authentification through interceptors and tokens. APiResource were handy when it came to simplicity.

### <i>"Actions have consequences"</i> : Observers. 

I've used Observers to get acquainted with them as well as waiting for a specific, model-related action to happen to take consequent action. For instance, at every transaction created, 
I want the balance of the sender and the receiver to change. Laravel 11 allows us to use Observers without using providers, but using Observers usually comes along with using providers. 

### <i>"Why is it called customer service? Because 'Your Problem Now' didn't test well."</i> : Services.

I've taken a bit of time to get familiar with services. They are very useful when it comes to using methods several times with different use cases and controllers. They allow subscription to certain events.
In the end it is kind of like Observers but in a more generic manner because EventEmitters allow us to listen to custom actions. 

### <i>"After a few migrations, my database was more confused than a toddler in a toy store."</i> : Models, Migrations, Factories, Seeders.
This is the veryfirst step of the project : building a cristall clear vision of the project. I've created this UML diagram to make it clearer for my supervisors and myself to manage attributes and tables. 

![V2](https://github.com/thatgirlAm/projetTest/assets/117035426/9bfeb668-37f5-471e-9e45-0a4c3ec8dc5a)

After building my database through CLI migrations, it was time to populate my tables with factice data. I've used factories for that and seeded my tables. I am describing a very simple process while it was so far 
being the truth. In fact, it was an ongoing adjustment from the start to the end of the project because there was always an issue that requiered to refresh the migrations and seed the tables all over again (ie : adding colums).

### <i>"Using Auth made logging in so easy, even my cat could access my bank account—wait, scratch that."</i> : Auth library. 
It was a very handy library. In fact, I used it to check user credentials, to log in etc. At first, I was doing manual manipulations that took forever to correctly end. With Auth, 5 lines worth of verification became one. 

## <i>"Angular 18: Making web development as easy as turning on a light—except when it's more like assembling IKEA furniture blindfolded."</i> : Front-End - Angular 18. 

No, I'm kidding...partially. In fact, at first understanding Angular seemed impossible; what do you mean a component? What do you mean I can't stash all my html in "pages" ??? As you can see the concept of "components"
was pretty odd to me but once I'd watched 6 days worth of youtube videos, I almost had it. So, lt's dive in...First, Angular is npm powered so pretty much CLI controlled, just like laravel (cool right?!).
Actually, the main aspect of Angular is that it is a tool that allows you to create single page apps. Because every one knows how thousands of requests of data can be expensive, energy-eating, and sometimes...useless, what do you mean because I clicked the wrong button, you will load it ALL again ??
So Angular made it its mission to siplify things by loading the data only a very few amount of times and to work hand in hand with the back-end to modify, act, etc. with the current amount of data it has, at T-0.

### <i>"What the hell is a component  ?"</i> : Angular Components.

A component is an object that, composed of a typescript script, a spec.typescript script, an html script, and a css script. It is this nice little functionnal thing that embarks all the actions, consequences, styles that concerns them.
A component can communicate with the back-end, with other components(in very a special way). There can be relationships between components child/parents. For instance, the main component of an gular app is the app component. It gathers all the components thanks to balises. 

### <i>"Communication is key..."</i> : Routes, guards, interceptors.

We could use the URL to navigate through different elements. To secure the navigation between multiple components, we like to use guards and interceptors. They use middleware functionnalities to secure the whole system. Guards allow us to manage the authentificationg and the access of the user to certain pages. Interceptors are managing the validation of tokens in the localStorage to make sure, the user has an ongoing valid session.

### <i>"Where browsers stash your secrets... until your session ends and it's all forgotten, like yesterday's leftovers."</i> : LocalStorage.

This thing was my saviour more than once. In fact, it is very practicall as it is a space for stocking data in the session. It was cleared at every end of session. I could leave a lot of <strong>*non sensitive*</strong> information.
To make the system more secure when you want to put the current token in your localstorage for instance, you could encrypt your localstorage with a special library : <a href="https://www.npmjs.com/package/localstorage-slim">localstroage Slim</a>.

### <i>"Validating Data from the Front: Because even forms deserve a red pen moment before hitting 'submit'."</i> : validating Data from the front.

Before the data is even sent to the back, it is more secure to secure the validation from the front, in the methods but most importnatly in the forms, to impose the format, the length, the requierements etc. of a form. That allows us not to pollute the database. Validators are pretty easy to use in formControllers (the input of a form). Those are the red text that appears when you submit an incorrect form.   

### <i>"Services in Angular are like Swiss Army knives—always handy, with that one weird tool you might need someday."</i> : services.

Here too we are using services. They have the very same function than the prious servises.

### <i>"Loaders make waiting bearable; it's like staring at a spinning thing instead of a crazy screen. Less ham, more progress!"</i> : Loaders.

This is purely a UX tool. We use loaders to be the wait more bearable, but, mostly to make it more understandable : I'd rather have a stupid round going to show me that my request has being taken up on than noticied than a crazy scrren.

### <i>"Interfaces are like having a cheat sheet in an exam—except you wrote the questions too."</i> : Interfaces, classes, instances.

Interfaces are objects we create that have their own...
Ok I got tired...here is a ChatGpt explanation of those 3 : 

<i>" 
Interfaces: Interfaces in Angular serve as blueprints for defining the structure of objects. They outline what properties and methods an object must have, ensuring consistency across different parts of your application. Think of them as a contract that any implementing class must adhere to. They're handy for maintaining uniformity and predictability in your codebase.

Classes
Classes: In Angular, classes are used to create objects that encapsulate data (properties) and behaviors (methods). They provide a way to define reusable components with specific functionality. Classes can inherit properties and methods from other classes through inheritance, promoting code reusability and modularization. In the context of Angular components, the main app component is a fundamental class that orchestrates and integrates other components.

Instances
Instances: Instances are specific objects created from a class. When you instantiate a class, you create an instance of that class—an actual, usable object in memory. In Angular, each component you define (like a login form or a transaction history) is an instance of a class. Instances allow you to work with multiple copies of the same blueprint (class) while keeping their data and functionality separate.
" </i>
### <i>"What ? Did I really spend days on this while it is a page with two rectangles ???"</i>: Modals.

Modals are small windows that appear the the page when it comes to alerting someone or to fill a form. 

## <i>You really though it went on that smooth ?? You fool ! < a href="https://www.youtube.com/shorts/REpLy96R2CQ?feature=share">"Tous les jours qu'on dors qu'on se reveille, y a des nouveaux dossiers"</a> </i> : problems.

We've had many many bugs (sinon c'est pas drôle ;) ) and I've learned a lotf rom them...

<ol>
  <li>The CORS error : CORS stands for Crossed-Origin Resource Sharing. Well...you know, the web doesn't not allow communication between two parts, to secure the thing. So it controlls everything that accessses the front part of the system. The basic backend has a different url, which is allowed by the server, but with the routes, we have a lsit of urls that do not correspond, which puts it on the persona non grata list. To avoid getting the CORS erro (that really blocks alll the work), I created the proxy that corresponded exactly to the allowed to access the data and hide my ugly urls.  </li>

  <li>Updating a chart, data, a list </li>: I suffered onthat one, you cannot refresh every 2 seconds, it goes against the single page application rule. So,'instead of refreshing, you will cait for certain actions and do something else, ie : filtering a chart of an id that has been deleted, using services to change the balance and changing the value at every subscriber. 
</ol>

 <i> SO here is everything I found interesting to share on this project, I don't know if I am going to do a detailed tutorial for laravel and angular but I've gone over a lot of concepts I think will be very useful in the future. </i>

 <strong> Muxu.</strong>

