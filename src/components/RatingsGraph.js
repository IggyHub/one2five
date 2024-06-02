import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const RatingsGraph = ({ data }) => {
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    useShadowColorFromDataset: false, // optional
  };

  const screenWidth = Dimensions.get('window').width*.6;

  // Assuming 'data' is structured as [{ date: 'YYYY-MM-DD', rating: number }, ...]
  //const labels = data.map(item => item.date);
  const labels = data.map(item => "");
  const datasets = [{
    data: data.map(item => item.rating)
  }];

  return (
    <LineChart
      data={{
        labels,
        datasets
      }}
      width={screenWidth}
      height={100}
      chartConfig={chartConfig}
      bezier
    />
  );
};

export default RatingsGraph;
