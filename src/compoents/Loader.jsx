import React from 'react';
import { Alert, Flex, Spin } from 'antd';
import '../App.css'; // make sure to import the CSS file

const contentStyle = {
  width: 400,            // Added width
  height: 400,           // Added height
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 7,
};

const content = <div style={contentStyle} />;

const App = () => (
  <div className='min-h-screen flex justify-center items-center'>
    <Flex gap="middle" vertical>
      <Flex>
        <Spin size="large">
          {content}
        </Spin>
      </Flex>
    </Flex>
  </div>
);

export default App;
