import sunny from "../assets/images/sunny.png"
import cloudy from "../assets/images/cloudy.png"
import rainy from "../assets/images/rainy.png"
import snowy from "../assets/images/snowy.png"
import loadingGif from "../assets/loading.gif"
import { useEffect, useState } from "react"




const WeatherApp = () => {
  const [data, setData ] = useState({})
  const [location, setLocation] = useState({
    lat: null,
    lon: null
  })
  const [loading, setLoading ] = useState(false)
  const api_key = 'c786aa1258b822d029210cfe5c7a71bd';

  useEffect(() => {
    setLoading(true);
    const fetchDeafaultWeather = async () => {
      const defaultLocation = {lat: 21, lon: 106}
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${defaultLocation.lat}&lon=${defaultLocation.lon}&appid=${api_key}&units=metric `
      const res = await fetch (url)
      const defaultData = await res.json();
      setData(defaultData);
      setLoading(false);
    }
    fetchDeafaultWeather()
  },[])


  const handleInputChange = (name, value) => {
    console.log("name:", value);
    setLocation({...location, [name]: value})
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter"){
      search();
    }
  }

  const weatherImages = {
    Clear: sunny,
    Clouds: cloudy,
    Snow: snowy,
    Haze: cloudy,
    Mist: cloudy
  }

  const weatherImage = data.weather ? weatherImages[data.weather[0].main] : null

  // const backgroundImages = {
  //   Clear: 'linear-gradient(to right, $orange, $lightOrange)',
  //   Clouds: 'linear-gradient(to right, $blue, $lightBlue)',
  //   Snow: 'linear-gradient(to right, $gray, $lightGray)',
  //   Haze: 'linear-gradient(to right, $blue, $lightBlue)',
  //   Mist: 'linear-gradient(to right, $blue, $lightBlue)',
  // }

  const backgroundImages = {
    Clear: 'linear-gradient(to right, #f3b07c, #fcd283)',
    Clouds: 'linear-gradient(to right, #57d6d4, #71eeec)',
    Snow: 'linear-gradient(to right, #aff2ff, #fff)',
    Haze: 'linear-gradient(to right, #57d6d4, #71eeec)',
    Mist: 'linear-gradient(to right, #57d6d4, #71eeec)',
  }

  const backgroundImage = data.weather ? backgroundImages[data.weather[0].main] : 'linear-gradient(to right, #f3b07c, #fcd283)'

  const currentDate = new Date();
  const daysOfWeek = ['Sun', "Mon", 'Tue', "Wed", "Thu", "Fri", "Sat"]
  const months = ['Jan', "Feb", 'Mar', "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dayOfWeek = daysOfWeek[currentDate.getDay()]
  const month = months[currentDate.getMonth()]
  const dayOfMonth = currentDate.getDate();
  const formattedDate = `${dayOfWeek}, ${dayOfMonth}, ${month}`
  

  const search = async () => {
    if(location.lat.trim() !== "" && location.lon.trim() !== ""){
      console.log("searchInput:", JSON.stringify(location,0,2));
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${api_key}&units=metric `
      const res = await fetch(url)
      const searchData = await res.json()
      if(searchData.cod !== 200){
        setData({notFound: true})
      }else{
        setData(searchData)
        console.log("searchData:", searchData);
        setLocation('');
      }
      setLoading(false);
    }
  }

  
  return (
    <div className="container" style={{backgroundImage}}>
        <div className="weather-app" style={{backgroundImage : backgroundImage && backgroundImage.replace ? backgroundImage.replace('to right', "to top") : null }}>
          <div className="search">
            <div className="search-top">
              <i className="fa-solid fa-location-dot"></i>
              <div className="location">{data.name ? data.name : ""} - {data.sys ? data.sys.country : ''}</div>
            </div>
            <div className="search-bar">
              <div>
                <input 
                  type="number" name="lat" placeholder="Enter Lat" 
                  min={-90}
                  max={90}
                  onChange={(e) => handleInputChange('lat', e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div>
                <input type="text" name="lon" placeholder="Enter Lon"
                   onChange={(e) => handleInputChange('lon', e.target.value)}
                   onKeyDown={handleKeyDown}
                  />
              </div>
              <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
             
            </div>
          </div>
          {loading ? (<img className="loader" src={loadingGif}/> 
          ) : data.notFound ? 
          (<div class="not-found">Not Found</div>
          ) : (
            <>
              <div className="weather">
                <img src={weatherImage} alt="sunny" />
                <div className="weather-type">{data.weather ? data.weather[0].main : null }</div>
                <div className="temp">{data.main ? <>
                                        {Math.floor(data.main.temp)}
                                        <sup>o</sup>
                                      </> : null}
                </div>
              </div>
              <div className="weather-date">
                <p>{formattedDate}</p>
              </div>
              <div className="weather-data">
                <div className="humidity">
                  <div className="data-name">Huminity</div>
                  <i className="fa-solid fa-droplet" />
                  <div className="data">{data.main ? data.main.humidity : null }</div>
                </div>
                <div className="wind">
                  <div className="data-name">Wind</div>
                  <i className="fa-solid fa-wind"/>
                  <div className="data">{data.wind ? `${data.wind.speed} km/h` : null} </div>
                </div>
              </div>
            </>
          )}
         
        </div>
    </div>
  )
}
export default WeatherApp
