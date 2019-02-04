function mile_if_1_else_miles(distance) {
  if (distance === 1) {
    return('mile');
  }
  return('miles');
}

// this was initially built off of catbook's structure for stories and comments
//https://github.com/mit6148-workshops/catbook-workshop4
// Creates an html block for a split
function orderDOMObject(orderJSON, user, isModal) {
  console.log(orderJSON);
  const card = document.createElement('div');
  if (isModal) {
    var pageLoc = '-modal';
  }
  else {
    var pageLoc = '-feed'
  }
  card.setAttribute('id', orderJSON._id + pageLoc);
  card.className = 'card split-card';

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  card.appendChild(cardBody);

  const row = document.createElement('div');
  row.className = 'row';
  cardBody.appendChild(row);

  const col1 = document.createElement('div');
  col1.className = 'col-sm';
  row.appendChild(col1);

  const col2 = document.createElement('div');
  col2.className = 'col-sm';
  row.appendChild(col2);

  const itemSpan = document.createElement('p');
  itemSpan.className = 'split-item card-title';

  const itemName = document.getElementById('')
  itemSpan.innerHTML = orderJSON.item + ', <span style="font-weight: normal">' + orderJSON.quantity + ' ' + orderJSON.units + '</span>';
  col1.appendChild(itemSpan);

  const linkSpan = document.createElement('a');
  linkSpan.className = 'split-link card-text';
  linkSpan.innerHTML = ' (link)';
  linkSpan.setAttribute('href', orderJSON.link);
  itemSpan.appendChild(linkSpan);

  const creatorSpan = document.createElement('a');
  creatorSpan.className = 'split-creator card-text';
  creatorSpan.innerHTML = orderJSON.creator_name + ' (' + orderJSON.location + ')';
  creatorSpan.setAttribute('href', '/u/profile?' + orderJSON.creator_id);
  col1.appendChild(creatorSpan);

  const availSpan = document.createElement('div');
  availSpan.className = 'card-text';
  availSpan.setAttribute('id', 'availSpans');
  availSpan.innerHTML = orderJSON.remaining + ' of ' + orderJSON.quantity + ' ' + orderJSON.units + ' available';
  col2.appendChild(availSpan);

  const startDate = document.createElement('div');
  startDate.innerHTML = "Start Date: "+ orderJSON.startDate;
  startDate.setAttribute('id', 'extraShit2');
  col2.appendChild(startDate);


  const expDate = document.createElement('div');
  expDate.setAttribute('id', 'extraShit');
  expDate.innerText = "Expiration Date: "+ orderJSON.expDate;
  col2.append(expDate);

  const cardFooter = document.createElement('div');
  cardFooter.className = "card-footer";
  card.appendChild(cardFooter);

  const claimsDiv = document.createElement('div');
  claimsDiv.setAttribute('id', orderJSON._id+'-claim');
  claimsDiv.className = 'story-comments';
  cardFooter.appendChild(claimsDiv);

  if (user._id !== undefined) {
    cardFooter.appendChild(newClaimDOMObject(card.id, orderJSON._id));
  }

  return card;
}

function startRowDOMObject(user) {
  const orderRow = document.createElement('row');
  orderRow.className = 'row';

  const orderButton = document.createElement('button');
  orderButton.className = 'btn-sp btn btn-primary col-sm';
  orderButton.setAttribute('type', 'button');
  orderButton.setAttribute('data-toggle', 'modal');
  if (user._id) {
    console.log('logged in');
    console.log(user.location);
    var theModal = '#loggedInModal';
  } else {
    var theModal = '#loggedOutModal';
  }
  orderButton.setAttribute('data-target', theModal);
  orderButton.setAttribute('id', 'newOButton');
  orderButton.innerHTML = 'Start a new order';
  orderRow.appendChild(orderButton);

  //https://www.w3schools.com/howto/howto_css_searchbar.asp
  const orderSearchBarCol = document.createElement('div');
  orderSearchBarCol.className = 'col-sm';
  orderRow.appendChild(orderSearchBarCol);

  const orderSearchBar = document.createElement('div');
  orderSearchBar.className = 'input-group mt-5';
  orderSearchBarCol.appendChild(orderSearchBar);

  const orderSearchInput = document.createElement('input');
  orderSearchInput.className = 'form-control';
  orderSearchInput.setAttribute('type', 'text');
  orderSearchInput.setAttribute('id', 'search-text');
  orderSearchInput.setAttribute("onkeydown",'searchDBenter()');
  orderSearchInput.setAttribute('placeholder', 'Search...')
  orderSearchBar.appendChild(orderSearchInput);

  const orderSearchButton = document.createElement('div');
  orderSearchButton.className = 'btn-sp btn input-group-btn';
  orderSearchButton.innerHTML = '<button class="btn-sp btn btn-primary" type="button" id="submissal" data-toggle = "modal" data-target = "#searchResultsModal">Search</button>';
  orderSearchButton.setAttribute("onclick", "searchDB()");
  //orderSearchButton.setAttribute("onkeydown", "searchDBenter()");
  orderSearchBar.appendChild(orderSearchButton);


  return orderRow;
}

function searchDBenter(){
  console.log(window.event.keyCode);
  if (window.event.keyCode === 13){
    const submitclaim = document.getElementById("submissal");
    submitclaim.click();
  }
}


function claimDOMObject(claimJSON) {
    claimDiv = document.createElement('div');
    claimDiv.setAttribute('id', claimJSON._id);
    claimDiv.className = "comment mb-2";

    const claimCreatorSpan = document.createElement('a');
    claimCreatorSpan.className = "comment-creator";
    claimCreatorSpan.innerHTML = claimJSON.user_name;
    claimCreatorSpan.setAttribute('href','/u/profile?'+claimJSON.user_id); //NOT properly getting creator_id/name
    claimDiv.appendChild(claimCreatorSpan);


    const claimContentSpan = document.createElement('span');
    claimContentSpan.className = "comment-content";
    claimContentSpan.innerHTML = ' | ' + claimJSON.quantity; //ideally will have units also
    claimDiv.appendChild(claimContentSpan);
    return claimDiv;

}

function newClaimDOMObject(sourceParent, orderParent) {
  // sourceParent is where it came from
  // (depends whether it appears as feed or search modal)
  // orderParent is the id of the order in the database
  const newClaimDiv = document.createElement('div');
  newClaimDiv.className = "comment input-group";

  const newClaimContent = document.createElement('input');
  newClaimContent.setAttribute("type", "number");
  newClaimContent.setAttribute("placeholder", "Amount to claim");
  newClaimContent.setAttribute("min", 0);
  newClaimContent.className = "form-control";
  newClaimContent.setAttribute("name", "quantity-input");
  newClaimContent.setAttribute("id", sourceParent+'-quantity-input');
  newClaimDiv.appendChild(newClaimContent);

  const newClaimParent = document.createElement("input");
  newClaimParent.setAttribute("type","hidden");
  newClaimParent.setAttribute("name","parent");
  newClaimParent.setAttribute("value", orderParent);
  newClaimDiv.appendChild(newClaimParent);

  const newClaimButtonDiv = document.createElement('div');
  newClaimButtonDiv.className = "input-group-append";
  newClaimDiv.appendChild(newClaimButtonDiv);

  const newClaimSubmit = document.createElement("button");
  newClaimSubmit.innerHTML = "Claim";
  newClaimSubmit.setAttribute('id', 'claimButtonK')
  newClaimSubmit.className = "btn-sp btn btn-outline-primary";
  newClaimSubmit.setAttribute('sourceParent', sourceParent);
  newClaimSubmit.setAttribute('orderParent', orderParent);
  newClaimSubmit.addEventListener('click', submitClaim);
  newClaimButtonDiv.appendChild(newClaimSubmit);

  return newClaimDiv;
}



function submitClaim() {
  const claimInput = document.getElementById(this.getAttribute('sourceParent')+'-quantity-input');
  const data = {
    quantity : claimInput.value,
    parent   : this.getAttribute('orderParent'),
  }

  const data1 = {
    parent: this.getAttribute('orderParent'),
    remaining : claimInput.value,
  }

  post('/api/claim',data);
  post('/api/remainder', data1);
  claimInput.value = '';

  window.location.reload();
}


function renderStartRow(user) {
  const startRowDiv = document.getElementById('start-row-container');
  startRowDiv.appendChild(startRowDOMObject(user));
}

//https://docs.mongodb.com/manual/text-search/
function searchDB() {
  const searchInput = document.getElementById('search-text').value.toLowerCase(); //make sure this is a string!
  const order = get('/api/orders', {item : searchInput}, function(ordersArray) {
    searchWords = searchInput.split(" ");
    alreadyReturned = [];
    get('/api/whoami', {}, function(user) {
      const searchRes = document.getElementById('search-results');
      for (let i=0; i < ordersArray.length; i++) {
        const currentO = ordersArray[i];
        currentItemWords = currentO.item.split(" ");
        for (let j=0; j < searchWords.length; j++) {
          for (let k=0; k < currentItemWords.length; k++) {
            newMatch = currentItemWords[k].includes(searchWords[j]) && !(alreadyReturned.includes(currentO));
            if (newMatch) {
              searchRes.prepend(orderDOMObject(currentO, user, true));
              alreadyReturned.push(currentO);
            }
          }
        }
      }
      const sirModal = document.getElementById("searchResultsModal");
      sirModal.style.display = "block";
    })
  });
}

function renderOrders(user) {
  const ordersDiv = document.getElementById('orders');
  get('/api/orders', {}, function(ordersArr) {
    for (let i = 0; i < ordersArr.length; i++) {
      const currentOrder = ordersArr[i];
      ordersDiv.prepend(orderDOMObject(currentOrder, user, false));

      get('/api/claim', {'parent' : currentOrder._id}, function(claimsArr){
        for (let j=0; j<claimsArr.length; j++) {
          const currentClaim = claimsArr[j];
          if (currentClaim.legal){
            const claimDivCurrent = document.getElementById(currentClaim.parent + '-claim');
            claimDivCurrent.appendChild(claimDOMObject(currentClaim))
          }
          
        }
      });
    }
  });
}

function cleanLink(url) {
  console.log(url);
  if (url.includes('http')) {
    return(url);
  }
  else {
    url = 'http://' + url;
    return(url);
  }
}