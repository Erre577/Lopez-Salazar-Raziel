import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import { List, ListItem, Text, Card, Button } from 'react-native-elements';
import firebase from '../firebasedb';

class BoardDetailScreen extends Component {
  
  constructor() {
    super();
    this.ref = firebase.firestore().collection('boards');
    this.state = {
      isLoading: true,
      board: {},
      key: ''
    };
  }
  
  componentDidMount() {
    const { route, navigation } = this.props;
    let str= route.params.boardkey;
    console.log("'"+str.replace(/['"]+/g, '')+"'");
    str= str.replace(/['"]+/g, '');
    console.log(''+route.params.boardkey)
    // obtener el documento utilizando route.params.boardkey
      const temp = this.ref.doc(str);
      //const temp = this.ref.doc('H9tBv3hy9sSwPEcj9Qng');

      const getdoc = temp.get().then(doc =>{
          if (doc) {
              
            /*console.log("doc.data:"+doc.data());
            console.log("doc.data0:"+doc.data(0));
            console.log("doc.id:"+doc.id);
            console.log("doc: "+ doc.title);  
            */
            this.setState({
                board: doc.data(),
                key: doc.id,
                isLoading: false
            });
          }
         else {
            console.log("No existe el elemento!");
         }
      })    
    
  }
  
  deleteBoard(key) {
    const { route, navigation } = this.props;
    this.setState({
      isLoading: true
    });
    // borrar el elemento utilizando el parametro key
    let str= route.params.boardkey;
    str= str.replace(/['"]+/g, '');
    this.ref.doc(str).delete().then(() => {
      console.log("Document successfully deleted!");
      this.setState({
        isLoading: false
      });
      navigation.navigate('Board');
    }).catch((error) => {
      console.error("Error removing document: ", error);
      this.setState({
        isLoading: false
      });
    }); 
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    return (
      <ScrollView>
        <Card style={styles.container}>
          <View style={styles.subContainer}>
            <View>
              <Text h3>{this.state.board.title}</Text>
            </View>
            <View>
              <Text h5>{this.state.board.description}</Text>
            </View>
            <View>
              <Text h4>{this.state.board.author}</Text>
            </View>
          </View>
          <View style={styles.detailButton}>
            <Button
              large
              backgroundColor={'#CCCCCC'}
              leftIcon={{name: 'edit'}}
              title='Edit'
              onPress={() => {
                this.props.navigation.navigate('EditBoard', {
                  boardkey: `${JSON.stringify(this.state.key)}`,
                });
              }} />
          </View>
          <View style={styles.detailButton}>
            <Button
              large
              backgroundColor={'#999999'}
              color={'#FFFFFF'}
              leftIcon={{name: 'delete'}}
              title='Delete'
              onPress={() => this.deleteBoard(this.state.key)} />
          </View>
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailButton: {
    marginTop: 10
  }
})


export default BoardDetailScreen;