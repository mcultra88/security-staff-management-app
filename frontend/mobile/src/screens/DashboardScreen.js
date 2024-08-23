import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext.tsx';
import api from '../utils/api';

const DashboardScreen = ({ navigation }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const response = await api.get('/events?status=upcoming&limit=5');
      setUpcomingEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    }
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventItem}
      onPress={() => navigation.navigate('EventDetails', { eventId: item._id })}
    >
      <Text style={styles.eventName}>{item.name}</Text>
      <Text>{new Date(item.date).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user.name}!</Text>
      <Text style={styles.sectionTitle}>Upcoming Events</Text>
      <FlatList
        data={upcomingEvents}
        renderItem={renderEventItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>No upcoming events</Text>}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EventList')}
        >
          <Text style={styles.buttonText}>All Events</Text>
        </TouchableOpacity>
        {user.role === 'admin' || user.role === 'manager' ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('StaffList')}
          >
            <Text style={styles.buttonText}>Manage Staff</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventName: {
    fontWeight: 'bold',
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default DashboardScreen;