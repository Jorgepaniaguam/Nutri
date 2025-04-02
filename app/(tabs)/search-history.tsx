
import { StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const STORAGE_KEY = "recent_searches"
const MAX_RECENT_SEARCHES = 10

export default function SearchHistory({ onSelectSearch }: { onSelectSearch: (query: string) => void }) {
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    loadSearchHistory()
  }, [])

  const loadSearchHistory = async () => {
    try {
      const savedSearches = await AsyncStorage.getItem(STORAGE_KEY)
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches))
      }
    } catch (error) {
      console.error("Error loading search history:", error)
    }
  }

  const clearSearchHistory = async () => {
    Alert.alert("Borrar historial", "¿Estás seguro que deseas borrar todo el historial de búsquedas?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Borrar",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(STORAGE_KEY)
            setRecentSearches([])
          } catch (error) {
            console.error("Error clearing search history:", error)
          }
        },
      },
    ])
  }

  const removeSearchItem = async (index: number) => {
    try {
      const updatedSearches = [...recentSearches]
      updatedSearches.splice(index, 1)
      setRecentSearches(updatedSearches)
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSearches))
    } catch (error) {
      console.error("Error removing search item:", error)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Historial de Búsquedas</ThemedText>
        {recentSearches.length > 0 && (
          <TouchableOpacity onPress={clearSearchHistory}>
            <ThemedText style={styles.clearText}>Borrar todo</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      {recentSearches.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color="#BDBDBD" />
          <ThemedText style={styles.emptyText}>No hay búsquedas recientes</ThemedText>
        </ThemedView>
      ) : (
        <ScrollView style={styles.scrollView}>
          {recentSearches.map((search, index) => (
            <ThemedView key={index} style={styles.searchItem}>
              <TouchableOpacity style={styles.searchContent} onPress={() => onSelectSearch(search)}>
                <Ionicons name="time-outline" size={20} color="#757575" style={styles.icon} />
                <ThemedText>{search}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeSearchItem(index)}>
                <Ionicons name="close-outline" size={20} color="#757575" />
              </TouchableOpacity>
            </ThemedView>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  clearText: {
    color: "#4CAF50",
  },
  scrollView: {
    flex: 1,
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 8,
  },
  searchContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    marginTop: 12,
    color: "#757575",
  },
})

