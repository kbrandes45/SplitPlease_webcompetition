function main() {
  const profileId = window.location.search.substring(1);
  get('/api/user', {'_id': profileId}, function(profileUser) {
    get('/api/whoami', {}, function(user) {
      renderNavbar(user);
      if (user._id === profileUser._id) {
        renderUserDataEditable(profileUser)
      } else {
        renderUserDataStatic(profileUser)
      }
    });
  });
}

//If the user is viewing someone else's profile they won't be able to edit and may see different info
function renderUserDataStatic(user) {
  // rendering name
  const nameContainer = document.getElementById('name-container');
  const nameHeader = document.createElement('h1');
  nameHeader.innerHTML = user.name;
  nameContainer.appendChild(nameHeader);

  // render location data
  const locationData = document.getElementById('location');
  locationData.innerText = user.location;

  // rendering latest post
  const latestPostCard = document.getElementById('latest-orders-card');

  get('/api/orders', {'creator_id': user._id}, function(orders) {
    if (orders.length === 0) {
      const noOrders = document.createElement('li');
      noOrders.className = 'list-group-item';
      noOrders.innerText = 'No orders yet!';
      latestPostCard.appendChild(noOrders);
    }
    for (var i=orders.length-1; i>=0; i--) {
      const order = document.createElement('li');
      order.className = "list-group-item";
      order.innerText = orders[i].item + ", " + orders[i].quantity + orders[i].units;
      latestPostCard.appendChild(order);
    }
  });

  const contactContainer = document.getElementById('profile-contact');
  contactContainer.innerText = user.email;
}

//If the user is viewing their own profile they are able to edit their information and manage their orders
function renderUserDataEditable(user) {
  // rendering name
  const nameContainer = document.getElementById('name-container');
  const nameHeader = document.createElement('h1');
  nameHeader.innerHTML = user.name;
  nameContainer.appendChild(nameHeader);

  // render location data on profile tab
  const locationData = document.getElementById('location');
  if (user.location === 'Unknown' || locationData.innerText === '') {
    locationData.innerText = user.location;
  } // This is super hacky and kinda cheap but it works

  //Add a button for editing the location
  const locationContainer = document.getElementById('location-data');
  const editLocButton = document.createElement('button');
  editLocButton.className = 'btn-sp btn btn-primary';
  editLocButton.setAttribute('type', 'button');
  editLocButton.setAttribute('data-toggle', 'modal');
  editLocButton.innerHTML = 'Edit Location';
  editLocButton.setAttribute('data-target', '#editLocModal');
  editLocButton.setAttribute('id', 'editLocBut');
  locationContainer.appendChild(editLocButton);

  const locations = [
    'Baker House',
    'Burton-Conner House',
    'East Campus',
    'MacGregor House',
    'Maseeh Hall',
    'McCormick Hall',
    'New House',
    'Next House',
    'Random House',
    'Simmons Hall',
    'Alpha Chi Omega',
    'Alpha Phi',
    'Delta Phi Epsilon',
    'Kappa Alpha Theta',
    'Pi Beta Phi',
    'Sigma Kappa',
    'Alpha Delta Phi',
    'Alpha Epsilon Pi',
    'Beta Theta Pi',
    'Chi Phi',
    'Delta Kappa Epsilon',
    'Delta Psi (Number 6)',
    'Delta Tau Delta',
    'Kappa Sigma',
    'Nu Delta',
    'Phi Beta Epsilon',
    'Phi Delta Theta',
    'Phi Kappa Sigma',
    'Phi Kappa Theta',
    'Phi Sigma Kappa',
    'Pi Lambda Phi',
    'Sigma Alpha Epsilon',
    'Sigma Chi',
    'Sigma Nu',
    'Sigma Phi Epsilon',
    'Tau Epsilon Phi',
    'Theta Chi',
    'Theta Delta Chi',
    'Theta Tau',
    'Theta Xi',
    'Zeta Beta Tau',
    'Zeta Psi',
    'Epsilon Theta',
    'Fenway House',
    'pika',
    'Student House',
    'WILG'
  ];

  renderLocOptions(locations);

  // rendering latest orders
  const latestPostCard = document.getElementById('latest-orders-card');

  get('/api/orders', {'creator_id': user._id}, function(orders) {
    if (orders.length === 0) {
      const noOrders = document.createElement('li');
      noOrders.className = 'list-group-item';
      noOrders.innerText = 'No orders yet!';
      latestPostCard.appendChild(noOrders);
    }
    for (var i=orders.length-1; i>=0; i--) {
      const order = document.createElement('li');
      order.className = "list-group-item";
      order.innerText = orders[i].item + ", " + orders[i].quantity + " " + orders[i].units;
      latestPostCard.appendChild(order);
    }
  });

  //Add tabs for the parts of the profile
  const tabs = document.getElementById('nav-tab');
  const profTab = document.createElement('a');
  profTab.className = 'nav-item nav-link active';
  profTab.setAttribute('id', 'nav-profile-tab');
  profTab.setAttribute('data-toggle', 'tab');
  profTab.setAttribute('href', '#nav-profile')
  profTab.setAttribute('role', 'tab');
  profTab.setAttribute('aria-controls', 'profile');
  profTab.setAttribute('aria-selected', 'true');
  profTab.innerText = 'Profile';
  tabs.appendChild(profTab);

  
  const ordersTab = document.createElement('a');
  ordersTab.className = 'nav-item nav-link';
  ordersTab.setAttribute('id', 'nav-orders-tab');
  ordersTab.setAttribute('data-toggle', 'tab');
  ordersTab.setAttribute('href', '#nav-orders')
  ordersTab.setAttribute('role', 'tab');
  ordersTab.setAttribute('aria-controls', 'profile');
  ordersTab.setAttribute('aria-selected', 'false');
  ordersTab.innerText = 'Manage Orders';
  tabs.appendChild(ordersTab);

  //Fill in the orders tab
  renderOrders(user);

  const contactContainer = document.getElementById('profile-contact');
  contactContainer.innerText = user.email;
}

//Render all of the users orders and make them manageable
function renderOrders(user) {
  const manageOrders = document.getElementById('nav-orders');
  get('/api/orders', {'creator_id': user._id, 'completed': false}, function(orders) {
    if (orders.length === 0) {
      const noOrders = document.createElement('div');
      noOrders.innerText = "No active orders";
      manageOrders.appendChild(noOrders);
    } else {
      for (var i=0; i<orders.length; i++) {
        //Create a card for the order
        const order = document.createElement('div');
        order.className = 'card';
        order.setAttribute('id', "profCards");

        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        order.appendChild(cardHeader);

        const cardRow = document.createElement('div');
        cardRow.className = 'row';
        cardHeader.appendChild(cardRow);

        const col1 = document.createElement('div');
        col1.className = 'col-sm';
        col1.setAttribute('id', 'columnF1');
        cardRow.appendChild(col1);

        const col2 = document.createElement('div');
        col2.className = 'col-sm';
        col2.setAttribute('id','columnF2');
        cardRow.appendChild(col2);

        const col3 = document.createElement('div');
        col3.className = 'col-sm';
        col3.setAttribute('id','columnF3');
        cardRow.appendChild(col3);

        const date = document.createElement('p');
        date.className = 'card-text';
        date.innerHTML = "Expiration Date: " + orders[i].expDate;
        col3.appendChild(date);
        
        const title = document.createElement('h5');
        title.className = 'card-title';
        title.setAttribute('id','OrderyTitle');
        title.innerText = orders[i].quantity + " " + orders[i].units + " of " + orders[i].item;
        col2.appendChild(title);
        //Say how much of the order remains unclaimed
        const remains = document.createElement('p');
        remains.className = 'card-text';
        remains.innerText = 'Amount of unclaimed items: '+orders[i].remaining;
        col1.appendChild(remains);

        const body = document.createElement('div');
        body.className = 'card-body';
        order.append(body);

        //List all of the users who've made a claim on the order
        const claims = document.createElement('ul');
        claims.className = 'list-group list-group-flush';
        //get all the claims and put em in the list
        get('/api/claim', {'parent' : orders[i]._id}, function(claimsArr){
          if (claimsArr.length === 0) {
            const claim = document.createElement('li');
            claim.className = 'list-group-item';
            claim.innerText = "There are no current claims for this order."
            claims.appendChild(claim);
          }
          for (var j=0; j<claimsArr.length; j++) {
            if (claimsArr[j].legal === true) {
              const claim = document.createElement('li');
              claim.className = 'list-group-item';
              claim.innerText = claimsArr[j].user_name + ': ' + claimsArr[j].quantity;
              claims.appendChild(claim);
            }
          }
        });
        body.appendChild(claims);

        const cardFoot = document.createElement('div');
        cardFoot.className = 'card-footer';
        order.append(cardFoot);

        //add buttons at the bottom for managing the order
        const buttons = document.createElement('div');
        buttons.className = 'order-manage-btns';
        const completeBtn = document.createElement('a');
        //completeBtn.setAttribute('href', '#');
        completeBtn.setAttribute('role', 'button');
        completeBtn.setAttribute('data-id', orders[i]._id);
        completeBtn.className = 'btn btn-success order-manage-btn';
        completeBtn.innerText = 'Place Order';
        completeBtn.setAttribute('data-toggle', 'modal');
        completeBtn.setAttribute('data-target', '#placeOrderModal');
        completeBtn.setAttribute('id', 'placeO');
        
        const cancelBtn = document.createElement('a');
        //cancelBtn.setAttribute('href', '#');
        cancelBtn.setAttribute('role', 'button');
        cancelBtn.setAttribute('data-id', orders[i]._id);
        cancelBtn.className = 'btn btn-danger order-manage-btn';
        cancelBtn.innerText = 'Cancel Order';
        cancelBtn.setAttribute('data-toggle', 'modal');
        cancelBtn.setAttribute('data-target', '#cancelOrderModal');
        cancelBtn.setAttribute('id','cancelO');
        buttons.appendChild(cancelBtn);
        buttons.appendChild(completeBtn);
        cardFoot.appendChild(buttons);
        manageOrders.appendChild(order);
      }
    }
  });
}

function placeOrder(orderID) {
  //send an e-mail to everyone who made a valid claim
  //this first requires figuring out what the order was for
  //then getting all of the claims
  var subject;
  var recipients = [];
  get('/api/orders', {'_id' : orderID}, function(order) {
    subject = "[Placing Order] Order of " + order.quantity + " " + order.units + " of " + order.item;
    get('/api/user', {'_id' : order.creator_id}, function(user) {
      recipients.push(user.email);
      var x=0;
      get('/api/claim', {'parent' : orderID}, function(claims) {
        if (claims.length === 0) {
          sendOrderEmail({'recip' : recipients, 'sub': 'Your order of '+order.item+' is being placed (but you already knew that)', 'order' : orderID});
        }
        for (var j=0; j<claims.length; j++) {
          if (claims[j].legal === true) {
            get('/api/user', {'_id' : claims[j].user_id}, function(user) {
              recipients.push(user.email);
              if (x === claims.length-1) {
                console.log('here');
                sendOrderEmail({'recip' : recipients, 'sub': subject, 'order' : orderID});
              }
              x++;
            });
          }
        }
      });
    });
  });
}

function sendOrderEmail(order) {
  post('/api/sendordermail', order);
  window.location.reload();
}

function sendCancelEmail(order) {
  post('/api/deleteordermail', order);
  window.location.reload();
}

function cancelOrder(orderID) {
  //Alrighty woooo that took a lot but we now know when and what order to delete
  //All this should consist of is removing it from the database
  //Also I want to notify everyone but that comes later
  //This is poorly written but it works?
  var subject;
  var recipients = [];
  get('/api/orders', {'_id' : orderID}, function(order) {
    subject = "[Cancelled Order] Order of " + order.quantity + " " + order.units + " of " + order.item +" has been cancelled";
    get('/api/user', {'_id' : order.creator_id}, function(user) {
      recipients.push(user.email);
      var x=0;
      get('/api/claim', {'parent' : orderID}, function(claims) {
        if (claims.length === 0) {
          sendCancelEmail({'recip' : recipients, 'sub': 'Your order of '+order.item+' has been cancelled', 'order' : orderID});
        }
        for (var j=0; j<claims.length; j++) {
          if (claims[j].legal === true) {
            get('/api/user', {'_id' : claims[j].user_id}, function(user) {
              recipients.push(user.email);
              if (x === claims.length-1) {
                sendCancelEmail({'recip' : recipients, 'sub': subject, 'order' : orderID});
              }
              x++;
            });
          }
        }
      });
    });
  });
}

function renderLocOptions(locArray) {
  const dropdown = document.getElementById('Input_loc');
  for (i=0; i < locArray.length; i++) {
    let currentOption = document.createElement('option');
    currentOption.setAttribute('value', locArray[i]);
    currentOption.innerHTML = locArray[i];
    dropdown.append(currentOption);
  }
  let otherOption = document.createElement('option');
  otherOption.setAttribute('value', 'Other');
  otherOption.setAttribute('id', 'other-option');
  otherOption.innerHTML = 'Other';
  dropdown.append(otherOption);
};

function showField(name) {
  if (name === 'Other') {
    document.getElementById('other-specify-box').innerHTML='Other: <input id="other-specify" type="text" class="form-control" name="Other" />';
  }
  else {
    document.getElementById('other-specify-box').innerHTML = '';
  }
}

main();

