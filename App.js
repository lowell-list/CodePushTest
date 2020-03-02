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

class App extends React.Component {

  /**
   * Component Lifecycle
   * --------------------------------------------------------------------------
   */

  constructor(props) {
    super(props)
    this.state = {
      serviceUrl: "",
      codePushLabel: "loading...",
      codePushDeploymentKey: "loading...",
      codePushStatus: "",
      codePushDownloadProgress: "N/A"
    }
  }

  componentDidMount() {
    CodePush.getUpdateMetadata().then((metadata) => {
      if(!metadata) {
        console.warn("warning: metadata is not set")
        return
      }
      this.setState({
        codePushLabel: metadata.label,
        codePushDeploymentKey: metadata.deploymentKey
      })
      console.log("CodePush Update Metadata:", metadata)
    });
  }

  /**
   * CodePush Callbacks
   * --------------------------------------------------------------------------
   */

  codePushStatusDidChange(status) {
    const statusMessageMap = {
      [CodePush.SyncStatus.UP_TO_DATE]: "UP_TO_DATE",
      [CodePush.SyncStatus.UPDATE_INSTALLED]: "UPDATE_INSTALLED",
      [CodePush.SyncStatus.UPDATE_IGNORED]: "UPDATE_IGNORED",
      [CodePush.SyncStatus.UNKNOWN_ERROR]: "UNKNOWN_ERROR",
      [CodePush.SyncStatus.SYNC_IN_PROGRESS]: "SYNC_IN_PROGRESS",
      [CodePush.SyncStatus.CHECKING_FOR_UPDATE]: "CHECKING_FOR_UPDATE",
      [CodePush.SyncStatus.AWAITING_USER_ACTION]: "AWAITING_USER_ACTION",
      [CodePush.SyncStatus.DOWNLOADING_PACKAGE]: "DOWNLOADING_PACKAGE",
      [CodePush.SyncStatus.INSTALLING_UPDATE]: "INSTALLING_UPDATE",
      default: "unknown state"
    }
    const codePushStatusString = statusMessageMap[status] || statusMessageMap.default
    console.log("CodePush status changed to " + codePushStatusString)
    this.setState({ codePushStatus: codePushStatusString })

    if(!CodePush.SyncStatus.DOWNLOADING_PACKAGE) {
      this.setState({ codePushDownloadProgress: "N/A" })
    }
  }
  
  codePushDownloadDidProgress(progress) {
    const progressDescription = progress.receivedBytes + "/" + progress.totalBytes
    this.setState({ codePushDownloadProgress: progressDescription })
    console.log(progressDescription)
  }
  
  /**
   * Utility
   * --------------------------------------------------------------------------
   */

  getDeploymentLabel(deploymentKey) {
    const deploymentLabelMap = {
      "b1Tt9y6qpJFRQ8aq2kYchYJy40TQZvg85gNMt": "iOS Production",
      "tBBpNCZevN08pnDsMt0PS_Q4WWHCnWpJcTRBQ": "iOS Production-Test",
      "iGrJG1v_tgKgRsAnmchkGBo50puxi7gGJcMtI": "iOS Staging",
      "rAYf54aQJ13x4Rbr78vDwL3zGKV8CxoCIiohk": "Android Production",
      "89WEIh6AVhtDuZAXwjckqWqnd_Pzek8HP_MNA": "Android Production-Test",
      "Mccw3aGJoMcbx7fQbnsiFYExqsmuk6Y4XWEK8": "Android Staging",
      default: "Unknown"
    }
    return deploymentLabelMap[deploymentKey] || deploymentLabelMap.default
  }

  doUrlsMatch(base, service) {
    return base.localeCompare(service);
  }

  handleResponse(res, url) {
    this.setState({ serviceUrl: url })
  }

  createGraphQLQuery(query) {
    return {
      query,
    };
  }

  /**
   * UI Handlers
   * --------------------------------------------------------------------------
   */

  onButtonPress() {
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

    const body = this.createGraphQLQuery(enviornmentConfig);
    return request
      .post(url)
      .send(body)
      .type('application/json')
      .accept('application/json')
      .then(res => this.handleResponse(res, url))
      .catch(res => this.handleResponse(res, url));
  }

  /**
   * Render
   * --------------------------------------------------------------------------
   */

  render() {
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
                <Text style={styles.sectionTitle}>Change Me</Text>
              </View>

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
                  {'CodePush Label: ' + this.state.codePushLabel}
                </Text>
                <Text style={styles.sectionDescription}>
                  {'CodePush Deployment Key: '
                    + this.state.codePushDeploymentKey
                    + " (" + this.getDeploymentLabel(this.state.codePushDeploymentKey) + ")"
                  }
                </Text>
                <Text style={styles.sectionDescription}>
                  {'CodePush Status: ' + this.state.codePushStatus}
                </Text>
                <Text style={styles.sectionDescription}>
                  {'CodePush Download Progress: ' + this.state.codePushDownloadProgress}
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
                <Button title="Query BE" onPress={() => this.onButtonPress()} />
                <Text
                  style={{
                    ...styles.sectionDescription,
                    color: this.doUrlsMatch(BASE_URL, this.state.serviceUrl) ? 'green' : 'red',
                  }}>
                  {this.state.serviceUrl && 'Service URL: ' + this.state.serviceUrl}
                </Text>
              </View>

            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    )
  }
}

/**
 * Styles
 * --------------------------------------------------------------------------
 */

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

/**
 * CodePush magic
 * --------------------------------------------------------------------------
 */

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME
}
const CodePushifiedApp = CodePush(codePushOptions)(App)

export default CodePushifiedApp;
