import React from 'react';
import { StyleSheet, Button, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { createStackNavigator } from 'react-navigation';

class ListItem extends React.Component{
  _onPressButton() {
    this.props.onSelect();
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={() => this._onPressButton()} >
          <Text style={styles.listItem}>{this.props.name}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dogs: [],
      searchText: '',
      filteredDogsList: [],
    }
  }

  static navigationOptions = {
    title: 'Dog List',
  };

  componentWillMount() {
    fetch('https://api.thedogapi.com/v1/breeds?limit=200&page=0', {
      method: 'GET',
      headers: {
        'x-api-key': '22ebdd4a-e45a-416d-83a9-5f78527ea0e1'
      }
    }).then(response => {
      response.json().then(data => {
        this.setState({dogs: data, filteredDogsList: data});
      })
    });
  }

  _onSearch(text) {
    const filteredDogs = this.state.dogs.filter(d => d.name.includes(text));
    this.setState({filteredDogsList: filteredDogs, searchText: text});
  }

  _onSelectBreed(id) {
   this.props.navigation.navigate('Details', {id});
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="Filtrar resultados"
          underlineColorAndroid='rgba(0,0,0,0)'
          style={{ padding: 20, backgroundColor: '#333', color: '#fff' }}
          onChangeText={(searchText) => this._onSearch(searchText)}
          value={this.state.searchText}
        />
        <FlatList
          data={this.state.filteredDogsList}
          renderItem={({ item }) => <ListItem name={item.name } onSelect={this._onSelectBreed.bind(this, item.id)} />}
          keyExtractor={item => item.name}
        />
      </View>
    );
  }
}

class Details extends React.Component {
  constructor(props){
    super(props);
    this.state = {dog: false};
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', '')
    }
  }

  componentWillMount() {
    const dogId = this.props.navigation.getParam('id');

    fetch(`https://api.thedogapi.com/v1/breeds/${dogId}`, {
      method: 'GET',
      headers: {
        'x-api-key': '22ebdd4a-e45a-416d-83a9-5f78527ea0e1'
      }
    }).then(response => {
      response.json().then(data => {
        this.props.navigation.setParams({ title: data.name })
          this.setState({ dog: data });
      })
    });
  }

  render() {
    return (
      <View style={styles.dogInfo}>
        {
          !!this.state.dog && <View>
            <Text style={styles.dogName}>{this.state.dog.name}</Text>
            <Text style={styles.dogLine}>
              <Text style={styles.dogParam}>Peso:</Text>
              <Text style={styles.dogParamValue}> {this.state.dog.weight.metric} </Text>
            </Text>
            <Text style={styles.dogLine}>
              <Text style={styles.dogParam}>Altura:</Text>
              <Text style={styles.dogParamValue}> {this.state.dog.height.metric} </Text>
            </Text>
            <Text style={styles.dogLine}>
              <Text style={styles.dogParam}>Lifespan:</Text>
              <Text style={styles.dogParamValue}> {this.state.dog.life_span} </Text>
            </Text>
            <Text style={styles.dogLine}>
              <Text style={styles.dogParam}>Famoso por:</Text>
              <Text style={styles.dogParamValue}> {this.state.dog.bred_for} </Text>
            </Text>
            <Text style={styles.dogLine}>
              <Text style={styles.dogParam}>Grupo:</Text>
              <Text style={styles.dogParamValue}> {this.state.dog.breed_group} </Text>
            </Text>
          </View>
        }
      </View>
    );
  }
}

export default createStackNavigator({
  Home: {
    screen: HomeScreen
  },
  Details: {
    screen: Details
  }
})

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 20,
  },
  dogInfo: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff'
  },
  dogName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },
  dogLine: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  dogParam: {
    fontWeight: 'bold',
  },
  dogParamValue: {
  }
});
