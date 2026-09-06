import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ searchWord, setSearchWord }) => {
  return (
    <div>
      find countries{' '}
      <input
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
      />
    </div>
  )
}

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const languages = Object.values(country.languages || {})
  const capital = country.capital?.[0]
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    if (!capital) return

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`
      )
      .then((response) => {
        setWeather(response.data)
      })
      .catch((error) => console.error('Error fetching weather:', error))
  }, [capital, api_key])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {capital}</div>
      <div>area {country.area}</div>

      <h3>languages:</h3>
      <ul>
        {languages.map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="150"
      />

      <h3>Weather in {capital}</h3>
      {weather ? (
        <div>
          <div>temperature {weather.main.temp} Celsius</div>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <div>wind {weather.wind.speed} m/s</div>
        </div>
      ) : (
        <div>Loading weather...</div>
      )}
    </div>
  )
}

const Content = ({ countriesToShow, setSearchWord }) => {
  if (countriesToShow.length > 10) {
    return <div>Too many matches, be more specific</div>
  }

  if (countriesToShow.length > 1) {
    return (
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {countriesToShow.map((country) => (
          <li key={country.cca3 || country.name.common}>
            {country.name.common}{' '}
            <button onClick={() => setSearchWord(country.name.common)}>
              show
            </button>
          </li>
        ))}
      </ul>
    )
  }

  if (countriesToShow.length === 1) {
    return <CountryDetail country={countriesToShow[0]} />
  }

  return <div>No matches found</div>
}

const App = () => {
  const [searchWord, setSearchWord] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('/api/all')
      .then((response) => {
        setCountries(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

  const countriesToShow = searchWord.trim() === ''
    ? []
    : countries.filter((country) =>
        country.name.common.toLowerCase().includes(searchWord.toLowerCase())
      )

  return (
    <div>
      <Filter searchWord={searchWord} setSearchWord={setSearchWord} />
      <Content
        countriesToShow={countriesToShow}
        setSearchWord={setSearchWord}
      />
    </div>
  )
}

export default App