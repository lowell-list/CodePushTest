/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {Header, Colors} from 'react-native/Libraries/NewAppScreen';
import VersionNumber from 'react-native-version-number';
const request = require('superagent-promise')(require('superagent'), Promise);

/**
 * options: 'staging' | 'production'
 */
const ENV = 'staging';

const App = () => {
  const createGraphQLQuery = query => {
    return {
      query,
    };
  };

  const onButtonPress = () => {
    const enviornmentConfig = {
      ENV,
      cognito: {
        userPoolId: 'us-west-2_zRrYIKPxb',
        appClientId: '2eu8amtkjm6e9oo2l4colvj67',
        config: 'default',
      },
      tealium: {},
      pager: {
        apiKeyAndroid: '1234',
        apiKeyIos: '1234',
      },
      mpulse: {
        appId: 'test',
        accountId: '1234',
      },
      buildSupport: {
        minimumIosVersion: 1,
        minimumIosSemantic: 2,
        minimumAndroidVersion: 3,
        minimumAndroidSemantic: 4,
      },
      providerSearchConfig: {
        quickSearchOptions: {},
      },
    };
    const url =
      ENV === 'staging'
        ? 'https://charli-app-api.uat.janusplatform.io/charli-app/graphql'
        : 'https://charli-app-api.prd.janusplatform.io/charli-app/graphql';

    const body = createGraphQLQuery(enviornmentConfig);
    const test = request
      .post(url)
      .send(body)
      .type('application/json')
      .accept('application/json')
      .then(res => console.log(res, url))
      .catch(res => console.log(res, url));
    console.log('ayyy lmao', test);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />

          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}

          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Code Push Test App</Text>
              <Text style={styles.sectionDescription}>
                {'Version: ' + VersionNumber.appVersion}
              </Text>
              <Text style={styles.sectionDescription}>
                {'Build Number: ' + VersionNumber.buildVersion}
              </Text>
              <Text style={styles.sectionDescription}>
                {'Bundle Identifier: ' + VersionNumber.bundleIdentifier}
              </Text>
              <Button title="Press me!" onPress={onButtonPress} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
