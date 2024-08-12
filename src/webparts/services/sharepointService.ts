
import { SPFI, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web"

import { Caching } from "@pnp/queryable";
import { getSP } from "../config/pnpConfig";
import LIST_CONFIG from "../config/listConfig";
import { RowData } from "../myReactSpfxApp/components/types";
 // Import the list configuration

export interface IResponseItem {
  [key: string]: any;
}

export interface IListItem {
  [key: string]: any;
}

// Generic function to get list items dynamically based on list name and columns
export const getListItems = async (listKey: string): Promise<IListItem[]> => {
  const listConfig = LIST_CONFIG[listKey as keyof typeof LIST_CONFIG];
  if (!listConfig) {
    throw new Error(`List configuration for ${listKey} not found`);
  }

  const { name: LIST_NAME, columns: COLUMNS } = listConfig;
  const _sp: SPFI = getSP();
  const spCache = spfi(_sp).using(Caching({ store: "session" }));

  try {
    const response: IResponseItem[] = await spCache.web.lists
      .getByTitle(LIST_NAME)
      .items.select(...COLUMNS)();

    const items: IListItem[] = response.map((item: IResponseItem) => {
      const mappedItem: IListItem = {};
      COLUMNS.forEach((column) => {
        mappedItem[column] = item[column] || "Unknown";
      });
      return mappedItem;
    });

    return items;
  } catch (err) {
    console.error(`Error retrieving list items for ${LIST_NAME}:`, err);
    throw err;
  }
};

export const createItem = async (listName: string, itemData: Record<string, any>): Promise<{ ID: number }> => {
  const _sp: SPFI = getSP();
  const spCache = spfi(_sp).using(Caching({ store: "session" }));

  try {
    const response =await spCache.web.lists
      .getByTitle(listName)
      .items.add(itemData);
      console.log(response);
      
      return response; 
  } catch (err) {
    console.error(`Error creating item in list ${listName}:`, err);
    throw err;
  }
};

export const deleteItem = async (listName: string, itemId: number): Promise<void> => {
  const _sp: SPFI = getSP();
  const spCache = spfi(_sp).using(Caching({ store: "session" }));

  try {
    await spCache.web.lists
      .getByTitle(listName)
      .items.getById(itemId)
      .delete();
  } catch (err) {
    console.error(`Error deleting item with ID ${itemId} from list ${listName}:`, err);
    throw err;
  }
};

/*const getCurrentUserId = async (): Promise<number> => {
  const _sp: SPFI = getSP();
  //const spCache = spfi(_sp).using(Caching({ store: "session" }));

  try {
    const currentUser = await _sp.web.currentUser();
    const userName = currentUser.Title;
    console.log(userName);
    console.log(currentUser);
    return currentUser.Id;
  } catch (err) {
    console.error(`Error getting current user:`, err);
    throw err;
  }
};*/
const getCurrentUserTitle = async (): Promise<string> => {
  const _sp: SPFI = getSP();
  const spCache = spfi(_sp).using(Caching({ store: "session" }));

  try {
    const currentUser = await spCache.web.currentUser();
    return currentUser.Title;
  } catch (err) {
    console.error(`Error getting current user:`, err);
    throw err;
  }
};

export const getAllProjectsByCurrentUser = async (listName: string): Promise<RowData[]> => {
  const _sp: SPFI = getSP();
  const spCache = spfi(_sp).using(Caching({ store: "session" }));

  try {
    const currentUserTitle= await getCurrentUserTitle();
    console
    const items = await spCache.web.lists
    .getByTitle(listName)
    .items.select()
    .filter(`Author/Title eq '${currentUserTitle}'`)();
    console.log(items)
    return items;
  } catch (err) {
    console.error(`Error fetching items from list ${listName}:`, err);
    throw err;
  }
};

// Function to update an existing project
/*export const updateProject = async (projectId: number, projectData: any) => {
  try {
    const _sp: SPFI = getSP();
    await _sp.web.lists.getByTitle('Projects').items.getById(projectId).update(projectData);
    console.log('Project updated successfully');
  } catch (error) {
    console.error('Error updating project:', error);
  }
};

// Function to delete a project
/*export const deleteProject = async (projectId: number) => {
  try {
    const _sp: SPFI = getSP();
    await _sp.web.lists.getByTitle('Projects').items.getById(projectId).delete();
    console.log('Project deleted successfully');
  } catch (error) {
    console.error('Error deleting project:', error);
  }
};*/

// Function to add data to related lists (example for Countries of Implementation)
export const addRelatedData = async (listName: string, data: any) => {
  try {
    const _sp: SPFI = getSP();
    await _sp.web.lists.getByTitle(listName).items.add(data);
    console.log(`${listName} data added successfully`);
  } catch (error) {
    console.error(`Error adding data to ${listName}:`, error);
  }
};


export const updateItemById = async (listName: string, itemId: number, data: object): Promise<void> => {
  try {
    const _sp: SPFI = getSP();
    await _sp.web.lists.getByTitle(listName).items.getById(itemId).update(data);
    console.log('item updated successfully');
  } catch (error) {
    console.error('Error updating project:', error);
  }
};

export const getRelatedTabByProject = async (listName: string): Promise<any[]> => {
  const _sp: SPFI = getSP();
  const spCache = spfi(_sp).using(Caching({ store: "session" }));

  try {
    const currentProjectID = sessionStorage.getItem('createdItemId');
    const items = await spCache.web.lists
      .getByTitle(listName)
      .items.select()
      .filter(`ProjectReferenceID eq '${currentProjectID}'`)();
    console.log(`Fetched items from ${listName}:`, items);
    return items;
  } catch (err) {
    console.error(`Error fetching items from list ${listName}:`, err);
    throw err;
  }
};