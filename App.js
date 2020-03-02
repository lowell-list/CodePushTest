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
import CodePush from "react-native-code-push";
import VersionNumber from 'react-native-version-number';
const request = require('superagent-promise')(require('superagent'), Promise);

/**
 * options: 'staging' | 'production'
 */
const ENV = 'staging';
const BASE_URL =
  ENV === 'production'
    ? 'https://charli-app-api.prd.janusplatform.io/charli-app'
    : 'https://charli-app-api.uat.janusplatform.io/charli-app';

const App = () => {
  /**
   * State
   */
  const [serviceUrl, setServiceUrl] = React.useState('');
  const [codePushLabel, setCodePushLabel] = React.useState('loading...');
  const [codePushDeploymentKey, setCodePushDeploymentKey] = React.useState('loading...');

  /**
   * Lifecycle Hooks
   */
  React.useEffect(() => {
    CodePush.getUpdateMetadata().then((metadata) => {
      setCodePushLabel(metadata.label);
      setCodePushDeploymentKey(metadata.deploymentKey);
      console.log("CodePush Update Metadata:", metadata)
    });
  }, []);

  /**
   * Methods
   */
  const getDeploymentLabel = (deploymentKey) => {
    const deploymentLabelMap = {
      iGrJG1v_tgKgRsAnmchkGBo50puxi7gGJcMtI: "Staging",
      default: "Unknown"
    }
    return deploymentLabelMap[deploymentKey] || deploymentLabelMap.default
  }
  const doUrlsMatch = (base, service) => {
    return base.localeCompare(service);
  };
  const handleResponse = (res, url) => {
    setServiceUrl(url);
  };
  const createGraphQLQuery = query => {
    return {
      query,
    };
  };

  const onButtonPress = () => {
    const enviornmentConfig = `
      query {
        environmentConfig {
        janusEnvironmentName
        cognito { appClientId userPoolId }
        tealium { account profile environment endpoint ios android }
        pager { apiKeyAndroid apiKeyIos }
        mpulse { accountId }
        buildSupport {
          minimumIosVersion
          minimumIosSemantic
          minimumAndroidVersion
          minimumAndroidSemantic
        }
      }
      providerSearchConfig {
        quickSearchOptions
      }
    }`;
    const url = BASE_URL + '/graphql';

    const body = createGraphQLQuery(enviornmentConfig);
    return request
      .post(url)
      .send(body)
      .type('application/json')
      .accept('application/json')
      .then(res => handleResponse(res, url))
      .catch(res => handleResponse(res, url));
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
              <Text style={styles.sectionTitle}>App Info</Text>
              <Text style={styles.sectionDescription}>
                {'Bundle Identifier: ' + VersionNumber.bundleIdentifier}
              </Text>
              <Text style={styles.sectionDescription}>
                {'Version: ' + VersionNumber.appVersion}
              </Text>
              <Text style={styles.sectionDescription}>
                {'Build Number: ' + VersionNumber.buildVersion}
              </Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Code Push</Text>
              <Text style={styles.sectionDescription}>
                {'CodePush Label: ' + codePushLabel}
              </Text>
              <Text style={styles.sectionDescription}>
                {'CodePush Deployment Key: '
                  + codePushDeploymentKey
                  + " (" + getDeploymentLabel(codePushDeploymentKey) + ")"
                }
              </Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Environment</Text>
              <Text style={styles.sectionDescription}>
                {'Environment: ' + ENV}
              </Text>
              <Text style={styles.sectionDescription}>
                {'Base URL: ' + BASE_URL}
              </Text>
              <Button title="Query BE" onPress={onButtonPress} />
              <Text
                style={{
                  ...styles.sectionDescription,
                  color: doUrlsMatch(BASE_URL, serviceUrl) ? 'green' : 'red',
                }}>
                {serviceUrl && 'Service URL: ' + serviceUrl}
              </Text>
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
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME
}
const CodePushifiedApp = CodePush(codePushOptions)(App)

export default CodePushifiedApp;
