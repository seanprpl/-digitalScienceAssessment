import React from 'react';
import './App.scss';
import jsonData from './data/formatted/output.json';
import { ResponsiveContainer, Pie, PieChart, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell, LabelList } from 'recharts';
import ReactWordcloud from 'react-wordcloud';

function App() {
  console.log('jsonData :>> ', jsonData);

  const pieChartData = Object.entries(jsonData.countries).map(country => {
    if (country[0] === "") { country[0] = 'Other'; }
    else if (country[0] === "United States") { country[0] = 'USA'; }
    else if (country[0] === "United Kingdom") { country[0] = 'UK'; }

    return {
      country: country[0],
      count: country[1]
    }
  });
  const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  

  const wordCloudData = Object.entries(jsonData.topics).map(topic => {
    const topicName = topic[0];
    let count = topic[1] > 200 ? 200 : topic[1];

    return { text: topicName, value: count };
  })

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
      <section className='inverted'>
        <h1>Demo visualization for Digital Science</h1>
        <div>
          <h4>Time Allocation</h4>
          <p>About 15 hours total. 1 hour planning how to do a quick mock from the data files. 7 hours parsing, transforming, filtering, and shaping the data. 7 hours on front end application design and basic visualizations.</p>
        </div>
        <h4>Technologies Used</h4>
          <ul>
            <li>React.js - Front end application</li>
            <li>Node.js - Data pre-processing script</li>
            <li>Recharts - Basic charting libraries</li>
            <li>React Wordcloud</li>
            <li>AWS S3 - Web hosting</li>
          </ul>
      </section>

      <section>
        <h2>Contributions by Country</h2>
        <ResponsiveContainer width={500} height={350} className='visualization'>
          <PieChart width={730} height={600}>
            <Pie 
              data={pieChartData} 
              dataKey="count" 
              nameKey="country" 
              cx="50%" 
              cy="50%" 
              outerRadius={130} 
              fill="#82ca9d" label>
              <LabelList 
                dataKey='country' 
                position='inside' 
                style={{ color: 'white' }}
              />
                { pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`} 
                    fill={pieColors[index]} />
                  ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo laborum commodi sed molestias ipsam. Doloremque temporibus voluptates repellendus pariatur recusandae, cum ducimus nesciunt labore voluptatum atque harum autem culpa eum molestiae ipsum repellat odit unde, blanditiis incidunt tempora architecto quia officia accusamus saepe! Corrupti ducimus quis natus aut, modi tempora doloremque nemo enim. Tempore necessitatibus iusto esse debitis totam, facere cupiditate quae libero error cumque beatae dolores voluptate nisi quia ullam, dignissimos nemo reprehenderit quo aliquid itaque voluptatum? Doloribus, enim. Dolor molestiae, maxime recusandae aperiam atque perspiciatis iure magnam ratione natus minima sunt quibusdam commodi aliquam cupiditate, earum nisi! Cupiditate quibusdam atque in nobis rerum fuga veritatis, obcaecati.</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum quam eum voluptate, consequuntur facere blanditiis nulla accusamus beatae fugiat aliquam ratione adipisci, aperiam exercitationem nam eligendi delectus aut sit, optio laboriosam quos debitis consequatur. Perferendis tempore aliquid corrupti quis blanditiis? Vero ut, consequatur explicabo ea quasi laudantium alias. Commodi accusamus accusantium necessitatibus ipsa vel sunt doloribus voluptatibus cupiditate similique numquam ex minima cum deserunt totam, ipsum dicta odio adipisci! Itaque consequuntur laudantium architecto cum harum possimus necessitatibus, sunt sapiente nam delectus, non, id quia iure aperiam. Asperiores ut reprehenderit laborum dicta facere esse perferendis obcaecati animi rerum culpa dolore dolores delectus soluta quae molestiae iusto, ex, quasi quis repellendus nihil quibusdam ipsam necessitatibus neque error. Porro officia, iure beatae soluta velit et cumque dolor omnis, ut inventore laudantium a non.
        </p>
      </section>

      <section>
        <h2>Topic Wordcloud</h2>
          <div className='visualization wordcloud-container'>
            <ReactWordcloud 
              words={wordCloudData}
              options={{ 
                rotations: 0,
                rotationAngles: [0, 0] }}
                size={[600, 400]}
            />
          </div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo laborum commodi sed molestias ipsam. Doloremque temporibus voluptates repellendus pariatur recusandae, cum ducimus nesciunt labore voluptatum atque harum autem culpa eum molestiae ipsum repellat odit unde, blanditiis incidunt tempora architecto quia officia accusamus saepe! Corrupti ducimus quis natus aut, modi tempora doloremque nemo enim. Tempore necessitatibus iusto esse debitis totam, facere cupiditate quae libero error cumque beatae dolores voluptate nisi quia ullam, dignissimos nemo reprehenderit quo aliquid itaque voluptatum? Doloribus, enim. Dolor molestiae, maxime recusandae aperiam atque perspiciatis iure magnam ratione natus minima sunt quibusdam commodi aliquam cupiditate, earum nisi! Cupiditate quibusdam atque in nobis rerum fuga veritatis, obcaecati.</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum quam eum voluptate, consequuntur facere blanditiis nulla accusamus beatae fugiat aliquam ratione adipisci, aperiam exercitationem nam eligendi delectus aut sit, optio laboriosam quos debitis consequatur. Perferendis tempore aliquid corrupti quis blanditiis? Vero ut, consequatur explicabo ea quasi laudantium alias. Commodi accusamus accusantium necessitatibus ipsa vel sunt doloribus voluptatibus cupiditate similique numquam ex minima cum deserunt totam, ipsum dicta odio adipisci! Itaque consequuntur laudantium architecto cum harum possimus necessitatibus, sunt sapiente nam delectus, non, id quia iure aperiam. Asperiores ut reprehenderit laborum dicta facere esse perferendis obcaecati animi rerum culpa dolore dolores delectus soluta quae molestiae iusto, ex, quasi quis repellendus nihil quibusdam ipsam necessitatibus neque error. Porro officia, iure beatae soluta velit et cumque dolor omnis, ut inventore laudantium a non.
        </p>
      </section>
      

      <section>
        <h2>Publications and Sponsors</h2>
        <BarChart 
          width={730} 
          height={250} data={publications} 
          className='visualization'
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="site" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>

          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo laborum commodi sed molestias ipsam. Doloremque temporibus voluptates repellendus pariatur recusandae, cum ducimus nesciunt labore voluptatum atque harum autem culpa eum molestiae ipsum repellat odit unde, blanditiis incidunt tempora architecto quia officia accusamus saepe! Corrupti ducimus quis natus aut, modi tempora doloremque nemo enim. Tempore necessitatibus iusto esse debitis totam, facere cupiditate quae libero error cumque beatae dolores voluptate nisi quia ullam, dignissimos nemo reprehenderit quo aliquid itaque voluptatum? Doloribus, enim. Dolor molestiae, maxime recusandae aperiam atque perspiciatis iure magnam ratione natus minima sunt quibusdam commodi aliquam cupiditate, earum nisi! Cupiditate quibusdam atque in nobis rerum fuga veritatis, obcaecati.</p>

        <BarChart 
          width={730} 
          height={250} data={sponsors} 
          className='visualization vert-spacer'
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sponsor" width={200} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum quam eum voluptate, consequuntur facere blanditiis nulla accusamus beatae fugiat aliquam ratione adipisci, aperiam exercitationem nam eligendi delectus aut sit, optio laboriosam quos debitis consequatur. Perferendis tempore aliquid corrupti quis blanditiis? Vero ut, consequatur explicabo ea quasi laudantium alias. Commodi accusamus accusantium necessitatibus ipsa vel sunt doloribus voluptatibus cupiditate similique numquam ex minima cum deserunt totam, ipsum dicta odio adipisci! Itaque consequuntur laudantium architecto cum harum possimus necessitatibus, sunt sapiente nam delectus, non, id quia iure aperiam. Asperiores ut reprehenderit laborum dicta facere esse perferendis obcaecati animi rerum culpa dolore dolores delectus soluta quae molestiae iusto, ex, quasi quis repellendus nihil quibusdam ipsam necessitatibus neque error. Porro officia, iure beatae soluta velit et cumque dolor omnis, ut inventore laudantium a non.
        </p>
      </section>

      <section className="inverted">
        <h2>
          Limitations and Possible Improvements
        </h2>

        <h4>
          Basic data manipulation 
        </h4>

        <p>
          There are only counts here. For more informative data that leverages natural language processing, and other data science methods, I would (hope to) work with a Data Scientist team member. I'd use his data to improve the insight and impact of the charts and presentations I build.
        </p>

        <h4>
          Static, Limited Dataset
        </h4>
        <p>
          To limit the scope of this project I took data from a single data file, ran it through a Counter class to sum totals, saved to a JSON file, and then charted it.
        </p>
        
        <p>
          In a work setting I would poll for new data from the source using an AWS Lambda function. I'd do this only if we expected updates. Upon such an update, a second request would grab the new records and post them to a database on AWS RDS or similar. 
        </p>
          
        <p>
          The Data Scientist would have API access to this dataset, which he manipulates and runs various calculations on. He provides his own API for my front end to then consume. I would have the front end application display this enriched data from the data science API.
        </p>

        <h4>
          Basic visualizations
        </h4>
        <p>
          Rich custom visualizations would be used to have a higher impact on our readers. Instead of Recharts I would build D3 visualizations. Large, multi-faceted datasets would help our readers understand complex interactions between multiple dimensions, increasing clarity and insight.
        </p>

        <h4>
          Modular design pattern
        </h4>
        <p>
          I would refactor the current large React component into a series of modules, something like a "VisualizationExplainer." These would represent independent sections of the article. Data would pass in to define the type, and datapoints for each chart, as well as accompanying headlines, text, sidebars, etc.
        </p>

      </section>
      
    </div>
  );
}

export default App;
