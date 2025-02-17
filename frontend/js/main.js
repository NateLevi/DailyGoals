document.querySelector('button').addEventListener('click', getFetch)

function getFetch() {
  const userSelection = document.querySelector('select').value;
  fetch(`http://localhost:8008/api/matches?league=${userSelection}`)
    .then(res => res.json())
    .then(data => {
      document.querySelector('section').innerHTML = data.videos || '<p>No videos found for the selected league today.</p>';
    })
    .catch(err => {
      console.log(`error ${err}`);
    });
}