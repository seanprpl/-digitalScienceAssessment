import React from 'react';
import './App.css';
import jsonData from './data/formatted/output.json';
import { ResponsiveContainer, Pie, PieChart, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend } from 'recharts';
import ReactWordcloud from 'react-wordcloud';

function App() {
  console.log('jsonData :>> ', jsonData);

  const pieChartData = Object.entries(jsonData.countries).map(country => {
    if (country[0] === "") { country[0] = 'Other'; }
    return {
      country: country[0],
      count: country[1]
    }
  });
  console.log('pieChartData :>> ', pieChartData);

  const wordCloudData = Object.entries(jsonData.topics).map(topic => {
    const topicName = topic[0];
    const count = Math.log(topic[1]);

    return { text: topicName, value: count };
  });

  const publications = Object.entries(jsonData.publications).map(pub => {
    const site = pub[0], count = pub[1];
    return { site, count };
  });

  const sponsors = Object.entries(jsonData.sponsorsCollaborators).map(pub => {
    const sponsor = pub[0].slice(0, 20), count = pub[1];
    return { sponsor, count };
  })
    .filter(obj => obj.sponsor.length);

  return (
    <div className="App">
      <h2>Contributions by Country</h2>
      <ResponsiveContainer width={100} height={50}>
        <PieChart width={730} height={250}>
          <Pie data={pieChartData} dataKey="count" nameKey="country" cx="50%" cy="50%" outerRadius={80} fill="#82ca9d" label />
        </PieChart>
      </ResponsiveContainer>
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit itaque facere iure adipisci, sit nemo quia dolorum ipsam nesciunt assumenda aspernatur explicabo corrupti dolor numquam labore veritatis dolores autem incidunt!</div>
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit itaque facere iure adipisci, sit nemo quia dolorum ipsam nesciunt assumenda aspernatur explicabo corrupti dolor numquam labore veritatis dolores autem incidunt!</div>
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit itaque facere iure adipisci, sit nemo quia dolorum ipsam nesciunt assumenda aspernatur explicabo corrupti dolor numquam labore veritatis dolores autem incidunt!</div>
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit itaque facere iure adipisci, sit nemo quia dolorum ipsam nesciunt assumenda aspernatur explicabo corrupti dolor numquam labore veritatis dolores autem incidunt!</div>


      <h2>Topic Wordcloud</h2>
      <ReactWordcloud words={wordCloudData} />
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit itaque facere iure adipisci, sit nemo quia dolorum ipsam nesciunt assumenda aspernatur explicabo corrupti dolor numquam labore veritatis dolores autem incidunt!</div>
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit itaque facere iure adipisci, sit nemo quia dolorum ipsam nesciunt assumenda aspernatur explicabo corrupti dolor numquam labore veritatis dolores autem incidunt!</div>
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit itaque facere iure adipisci, sit nemo quia dolorum ipsam nesciunt assumenda aspernatur explicabo corrupti dolor numquam labore veritatis dolores autem incidunt!</div>
      <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit itaque facere iure adipisci, sit nemo quia dolorum ipsam nesciunt assumenda aspernatur explicabo corrupti dolor numquam labore veritatis dolores autem incidunt!</div>

      <h2>Publications and Sponsors</h2>
      <BarChart width={730} height={250} data={publications}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="site" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>

      <BarChart width={730} height={250} data={sponsors}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sponsor" width={200} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>

    </div>
  );
}

export default App;
