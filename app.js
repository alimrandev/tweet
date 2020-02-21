// selection element
const tweetInput = document.querySelector('#tweetTxt');
const submitTweet = document.querySelector('#submit');
const ul = document.querySelector('.collection');
const deletTweet = document.querySelector('.delete');
const searchTweet = document.querySelector('#filter');
const setmsgs = document.createElement('h5');
// data or state
let tweetData = getDataFromLs();

// get data from LS
function getDataFromLs(){
  let tweets = '';
  if(localStorage.getItem('tweetLists') === null){
    tweets = []
  }else{
    tweets = JSON.parse(localStorage.getItem('tweetLists'));
  }
  return tweets;
}
// set items to LS
function setItemToLs(item){
  let tweets = '';
  if(localStorage.getItem('tweetLists')=== null){
    tweets = []
    tweets.push(item)
    localStorage.setItem('tweetLists',JSON.stringify(tweets));
  }else{
    tweets = JSON.parse(localStorage.getItem('tweetLists'));
    tweets.push(item);
    localStorage.setItem('tweetLists', JSON.stringify(tweets))
  }
}
// delete data from ls
function deleteFromLs(id){
  let items = JSON.parse(localStorage.getItem('tweetLists'));
  let result = items.filter((dataId) => {
    return dataId.id !== id;
  })
  localStorage.setItem('tweetLists',JSON.stringify(result));
}
// set msgs
function msgs(massage) {
  setmsgs.textContent = massage;
  ul.insertBefore(setmsgs, ul.childNodes[0])
}
// load events
function loadEvent() {
  // addTweet
  submitTweet.addEventListener('click', addTweet);
  // delete item
ul.addEventListener('click', deleteTweet);
// filter tweet
searchTweet.addEventListener('keyup', filterTweet);
}
// Tweet Feed UI
function tweet(items) {
  msgs('')
  if (items.length > 0) {
    items.forEach(({ id, tweetTxt, sl, today }) => {
      // creating li
      const li = document.createElement('li');
      li.className = 'list-group-item collection-item mt-2';
      li.id = `tweet-${id}`;
      li.innerHTML = `
      <span class="mr-2 p-1 bg-success text-light rounded">${sl}</span><span>${tweetTxt}</span></span><span class = 'ml-4 text-info font-italic'>${today}</span><i class="fas fa-trash float-right delete text-danger"></i>
      `
      ul.appendChild(li);
    });
  } else {
    msgs('No Tweets')
  }

}
const addTweet = (e) => {

  let tweetTxt = tweetInput.value;
  let today =`Post Date - ${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`;
  if (tweetTxt === '') {
    alert('input value!')
  } else {
    let id;
    let sl;
    if (tweetData.length === 0) {
      id = 0;
      sl = 1
    } else {
      id = tweetData[tweetData.length - 1].id + 1;
      sl = tweetData[tweetData.length - 1].sl + 1;

    }
    const data = {
      id,
      sl,
      tweetTxt,
      today
    }
    ul.innerHTML = ''
    tweetData.push(data);
    tweet(tweetData)
    setItemToLs(data)
    tweetInput.value = ''
  }
  e.preventDefault()
  
}
const deleteTweet = (e) => {
  if (e.target.classList.contains('delete')) {
    const target = e.target.parentElement
    target.parentElement.removeChild(target);
    let id = parseInt(target.id.split('-')[1]);
    let result = tweetData.filter((dataId) => {
      return dataId.id !== id;
    })
    deleteFromLs(id)
    tweetData = result;
  }
  if (tweetData.length === 0) {
    window.location.reload();
  }
}
const filterTweet = (e) => {
  let tweetLength = 0;
  const searchTxt = e.target.value.toLowerCase();
  document.querySelectorAll('.collection-item').forEach((tweet) => {
    const tweetTxt = tweet.firstElementChild.nextSibling.textContent.toLowerCase();
    if (tweetTxt.indexOf(searchTxt) === -1) {
      tweet.style.display = 'none';
    } else {
      tweet.style.display = 'block';
      tweetLength++;
    }
  })
  tweetLength > 0 ? msgs('') : msgs('No Tweet Found');
}

tweet(tweetData)
loadEvent();