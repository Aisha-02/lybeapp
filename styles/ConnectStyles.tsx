import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Search Container
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.searchBar,
    borderColor: Colors.searchBarBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  searchIcon: {
    marginRight: 8,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.buttonText,
    paddingVertical: 0,
  },
  
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  
  // Results Header
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  
  resultsCount: {
    color: Colors.ionIcon,
    fontSize: 14,
    fontWeight: '500',
  },
  
  // User Item
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: Colors.searchBar,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.searchBarBorder,
  },
  
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.albumImage,
    marginRight: 12,
  },
  
  userDetails: {
    flex: 1,
  },
  
  username: {
    color: Colors.track,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  
  currentVibe: {
    color: Colors.artist,
    fontSize: 14,
    fontStyle: 'italic',
  },
  
  // Action Buttons
  actionButtons: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },
  
  dedicateButton: {
    backgroundColor: Colors.loading,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  
  dedicateText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: "600",
  },
  
  removeButton: {
    backgroundColor: Colors.error,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  
  removeText: {
    color: Colors.buttonText,
    fontSize: 12,
    fontWeight: "600",
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  
  loadingText: {
    color: Colors.ionIcon,
    fontSize: 16,
    marginTop: 12,
  },
  
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  
  errorText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: "600",
    textAlign: 'center',
    marginVertical: 12,
  },
  
  retryButton: {
    backgroundColor: Colors.loading,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  
  retryText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  
  noResults: {
    fontSize: 18,
    color: Colors.noResults,
    textAlign: "center",
    fontWeight: '600',
    marginTop: 16,
  },
  
  noResultsSubtext: {
    fontSize: 14,
    color: Colors.ionIcon,
    textAlign: "center",
    marginTop: 8,
  },
  
  contentContainer: {
    paddingBottom: 100,
  },
});

export default styles;
