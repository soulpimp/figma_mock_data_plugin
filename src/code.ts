/// <reference types="@figma/plugin-typings" />
import { faker } from '@faker-js/faker';

figma.showUI(__html__, { 
  width: 300,
  height: 500,
  themeColors: true, 
});


// ---------------------------------------------------------------------------
// TEMPLATE BUILDERS
// ---------------------------------------------------------------------------

// User Card Template
async function createUserComponent() {
  const card = figma.createFrame();
  card.name = "User Card";
  card.resize(280, 120);
  card.cornerRadius = 8;
  card.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.96, b: 0.98 } }];

  card.layoutMode = "HORIZONTAL";
  (card as any).counterAxisSizingMode = "AUTO";
  card.paddingLeft = 16;
  card.paddingRight = 16;
  card.paddingTop = 16;
  card.paddingBottom = 16;
  card.itemSpacing = 16;
  card.counterAxisAlignItems = "CENTER";

  const avatar = figma.createEllipse();
  avatar.name = "avatar";
  avatar.resize(56, 56);
  avatar.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.85 } }];

  const textGroup = figma.createFrame();
  textGroup.name = "Content";
  textGroup.layoutMode = "VERTICAL";
  textGroup.itemSpacing = 4;
  textGroup.fills = [];
  (textGroup as any).counterAxisSizingMode = "AUTO";

  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  const nameNode = figma.createText();
  nameNode.name = "name";
  nameNode.fontName = { family: "Inter", style: "Bold" };
  nameNode.fontSize = 16;
  nameNode.characters = "Placeholder Name";

  const roleNode = figma.createText();
  roleNode.name = "role";
  roleNode.fontName = { family: "Inter", style: "Regular" };
  roleNode.fontSize = 13;
  roleNode.characters = "Placeholder Role";
  roleNode.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];

  const emailNode = figma.createText();
  emailNode.name = "email";
  emailNode.fontName = { family: "Inter", style: "Regular" };
  emailNode.fontSize = 12;
  emailNode.characters = "placeholder@example.com";
  emailNode.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];

  textGroup.appendChild(nameNode);
  textGroup.appendChild(roleNode);
  textGroup.appendChild(emailNode);

  card.appendChild(avatar);
  card.appendChild(textGroup);

  try {
    const [dynamicRecord] = await generateMockDataWithAvatars('user_profile', 1);

    if (dynamicRecord) {
      await populateContainer(card, dynamicRecord);
    }
  } catch (err) {
    console.warn("Could not generate dynamic data for template:", err);
  }

  const component = figma.createComponentFromNode(card);
  positionOnCanvas(component);
  figma.notify("Created dynamic example component!");
}

// Product Template
async function createProductComponent() {
const card = figma.createFrame();
  card.name = "Product Card";
  card.resize(220, 280);
  card.cornerRadius = 8;
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.92 } }];
  card.strokeWeight = 1;

  // Vertical layout configured to push footer to bottom
  card.layoutMode = "VERTICAL";
  (card as any).counterAxisSizingMode = "FIXED";
  card.primaryAxisSizingMode = "AUTO"; 
  card.primaryAxisAlignItems = "SPACE_BETWEEN"; // Keeps footer pinned at the bottom
  card.paddingLeft = 12;
  card.paddingRight = 12;
  card.paddingTop = 12;
  card.paddingBottom = 12;
  card.itemSpacing = 8;

  const imageNode = figma.createRectangle();
  imageNode.name = "image";
  imageNode.resize(216, 140);
  imageNode.cornerRadius = 8;
  imageNode.fills = [{ type: 'SOLID', color: { r: 0.92, g: 0.92, b: 0.95 } }];

  const metaFrame = figma.createFrame();
  metaFrame.name = "Meta";
  metaFrame.layoutMode = "VERTICAL";
  metaFrame.itemSpacing = 4;
  metaFrame.fills = [];
  metaFrame.layoutAlign = "STRETCH";

  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  const categoryNode = figma.createText();
  categoryNode.name = "category";
  categoryNode.fontName = { family: "Inter", style: "Medium" };
  categoryNode.fontSize = 11;
  categoryNode.characters = "CATEGORY";
  categoryNode.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.55 } }];

  const nameNode = figma.createText();
  nameNode.name = "name";
  nameNode.fontName = { family: "Inter", style: "Bold" };
  nameNode.fontSize = 15;
  nameNode.characters = "Product Title";

  metaFrame.appendChild(categoryNode);
  metaFrame.appendChild(nameNode);

  const footerRow = figma.createFrame();
  footerRow.name = "Footer";
  footerRow.layoutMode = "HORIZONTAL";
  footerRow.primaryAxisSizingMode = "FIXED";
  (footerRow as any).counterAxisSizingMode = "AUTO";
  footerRow.layoutAlign = "STRETCH";
  footerRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  footerRow.counterAxisAlignItems = "CENTER";
  footerRow.fills = [];

  const priceNode = figma.createText();
  priceNode.name = "price";
  priceNode.fontName = { family: "Inter", style: "Bold" };
  priceNode.fontSize = 16;
  priceNode.characters = "$0.00";

  const ratingNode = figma.createText();
  ratingNode.name = "rating";
  ratingNode.fontName = { family: "Inter", style: "Medium" };
  ratingNode.fontSize = 12;
  ratingNode.characters = "★ 0.0";
  ratingNode.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.6, b: 0.1 } }];

  footerRow.appendChild(priceNode);
  footerRow.appendChild(ratingNode);

  card.appendChild(imageNode);
  card.appendChild(metaFrame);
  card.appendChild(footerRow);

  const [productRecord] = generateMockData('product_catalog', 1);
  if (productRecord) {
    const productImageUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';
    const imageBytes = await fetchImageViaUI(productImageUrl);
    if (imageBytes) productRecord.image = imageBytes;

    await populateContainer(card, productRecord);
  }

  const component = figma.createComponentFromNode(card);
  positionOnCanvas(component);
  figma.notify("Created Product Catalog Component!");
}

// Data Table Template
async function createTableComponent(initialRows: number = 5) {
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  const table = figma.createFrame();
  table.name = "Data Table";
  table.layoutMode = "VERTICAL";
  (table as any).counterAxisSizingMode = "AUTO";
  table.primaryAxisSizingMode = "AUTO";
  table.cornerRadius = 8;
  table.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  table.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.9 } }];
  table.strokeWeight = 1;

  const header = figma.createFrame();
  header.name = "Table Header";
  header.layoutMode = "HORIZONTAL";
  header.paddingLeft = 16;
  header.paddingRight = 16;
  header.paddingTop = 12;
  header.paddingBottom = 12;
  header.itemSpacing = 24;
  header.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.96, b: 0.98 } }];

  const columns = [
    { title: "Transaction ID", width: 120 },
    { title: "Amount", width: 90 },
    { title: "Status", width: 90 },
    { title: "Date", width: 100 }
  ];

  for (const col of columns) {
    const headerCell = figma.createText();
    headerCell.fontName = { family: "Inter", style: "Bold" };
    headerCell.fontSize = 12;
    headerCell.characters = col.title;
    headerCell.resize(col.width, 16);
    headerCell.fills = [{ type: 'SOLID', color: { r: 0.3, g: 0.3, b: 0.35 } }];
    header.appendChild(headerCell);
  }

  table.appendChild(header);

  const records = generateMockData('financial_table', initialRows);
  for (let i = 0; i < initialRows; i++) {
    const rowNode = await createTableRowNode(columns, records[i]);
    table.appendChild(rowNode);
  }

  positionOnCanvas(table);
  figma.notify(`Created Table with ${initialRows} populated rows!`);
}

async function createTableRowNode(
  columns: Array<{ title: string; width: number }>, 
  recordData: Record<string, any>
): Promise<FrameNode> {
  const row = figma.createFrame();
  row.name = "Table Row";
  row.layoutMode = "HORIZONTAL";
  row.paddingLeft = 16;
  row.paddingRight = 16;
  row.paddingTop = 12;
  row.paddingBottom = 12;
  row.itemSpacing = 24;
  row.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  row.strokes = [{ type: 'SOLID', color: { r: 0.94, g: 0.94, b: 0.96 } }];
  row.strokeWeight = 1;

  const keys = ['id', 'amount', 'status', 'date'];

  for (let i = 0; i < columns.length; i++) {
    const cellText = figma.createText();
    const key = keys[i];
    cellText.name = key;
    cellText.fontName = { family: "Inter", style: "Regular" };
    cellText.fontSize = 13;
    cellText.characters = String(recordData[key] || "—");
    cellText.resize(columns[i].width, 18);
    
    row.appendChild(cellText);
  }

  return row;
}

// Default templates

function configureTextNode(textNode: TextNode) {
  textNode.textAutoResize = "HEIGHT"; 

  // Check if parent exists and uses Auto Layout
  const parent = textNode.parent;
  const isParentAutoLayout = parent && 'layoutMode' in parent && parent.layoutMode !== "NONE";

  if (isParentAutoLayout) {
    if ('layoutSizingHorizontal' in textNode) {
      textNode.layoutSizingHorizontal = "FILL";
    } else {
      (textNode as any).layoutAlign = "STRETCH";
    }
  } else {
    // Fallback if not inside Auto Layout yet
    if ('layoutSizingHorizontal' in textNode) {
      textNode.layoutSizingHorizontal = "FIXED";
    }
  }
}

async function buildDefaultUserCardNode(): Promise<FrameNode> {
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  const card = figma.createFrame();
  card.name = "User Card";
  card.resize(240, 96);
  card.cornerRadius = 8;
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.92 } }];
  card.strokeWeight = 1;

  card.layoutMode = "HORIZONTAL";
  (card as any).counterAxisSizingMode = "AUTO";
  card.paddingLeft = 12;
  card.paddingRight = 12;
  card.paddingTop = 12;
  card.paddingBottom = 12;
  card.itemSpacing = 12;
  card.counterAxisAlignItems = "CENTER";

  const avatar = figma.createEllipse();
  avatar.name = "avatar";
  avatar.resize(48, 48);
  avatar.fills = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.92 } }];

  const textGroup = figma.createFrame();
  textGroup.name = "Content";
  textGroup.layoutMode = "VERTICAL";
  textGroup.itemSpacing = 2;
  textGroup.fills = [];

  // 1. Append child elements FIRST to establish Auto Layout hierarchy
  card.appendChild(avatar);
  card.appendChild(textGroup);

  // Now that textGroup is inside card (Auto Layout), set FILL on textGroup
  if ('layoutSizingHorizontal' in textGroup) {
    textGroup.layoutSizingHorizontal = "FILL";
  } else {
    (textGroup as any).layoutAlign = "STRETCH";
  }

  const nameNode = figma.createText();
  nameNode.name = "name";
  nameNode.fontName = { family: "Inter", style: "Bold" };
  nameNode.fontSize = 14;
  nameNode.characters = "User Name";

  const roleNode = figma.createText();
  roleNode.name = "role";
  roleNode.fontName = { family: "Inter", style: "Regular" };
  roleNode.fontSize = 12;
  roleNode.characters = "Job Title";
  roleNode.fills = [{ type: 'SOLID', color: { r: 0.45, g: 0.45, b: 0.5 } }];

  const emailNode = figma.createText();
  emailNode.name = "email";
  emailNode.fontName = { family: "Inter", style: "Regular" };
  emailNode.fontSize = 11;
  emailNode.characters = "user@example.com";
  emailNode.fills = [{ type: 'SOLID', color: { r: 0.65, g: 0.65, b: 0.7 } }];

  // 2. Append text nodes to textGroup FIRST
  textGroup.appendChild(nameNode);
  textGroup.appendChild(roleNode);
  textGroup.appendChild(emailNode);

  // 3. Apply configureTextNode AFTER text nodes are attached inside textGroup
  configureTextNode(nameNode);
  configureTextNode(roleNode);
  configureTextNode(emailNode);

  return card;
}

async function buildDefaultProductCardNode(): Promise<FrameNode> {
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  const card = figma.createFrame();
  card.name = "Product Card";
  card.resize(220, 280);
  card.cornerRadius = 8;
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.92 } }];
  card.strokeWeight = 1;

  // Auto Layout settings for card body
  card.layoutMode = "VERTICAL";
  (card as any).counterAxisSizingMode = "FIXED"; // Width adapts to parent flex
  (card as any).primaryAxisSizingMode = "AUTO";  // Height fits content dynamically
  card.paddingLeft = 12;
  card.paddingRight = 12;
  card.paddingTop = 12;
  card.paddingBottom = 12;
  card.itemSpacing = 8;

  // 1. Image Node - STRETCH horizontally to fill expanding card width
  const imageNode = figma.createRectangle();
  imageNode.name = "image";
  imageNode.resize(196, 120);
  imageNode.cornerRadius = 6;
  imageNode.layoutAlign = "STRETCH"; // Spans full card width
  imageNode.fills = [{ type: 'SOLID', color: { r: 0.92, g: 0.92, b: 0.95 } }];

  // 2. Category Tag
  const categoryNode = figma.createText();
  categoryNode.name = "category";
  categoryNode.fontName = { family: "Inter", style: "Medium" };
  categoryNode.fontSize = 10;
  categoryNode.characters = "CATEGORY";
  categoryNode.layoutAlign = "STRETCH";
  categoryNode.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.55 } }];

  // 3. Product Title
  const nameNode = figma.createText();
  nameNode.name = "name";
  nameNode.fontName = { family: "Inter", style: "Bold" };
  nameNode.fontSize = 14;
  nameNode.characters = "Product Name";
  nameNode.layoutAlign = "STRETCH";

  // 4. Footer Row (Price + Rating)
  const footerRow = figma.createFrame();
  footerRow.name = "Footer";
  footerRow.layoutMode = "HORIZONTAL";
  footerRow.layoutAlign = "STRETCH"; // Spans full card width
  footerRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  footerRow.counterAxisAlignItems = "CENTER";
  footerRow.fills = [];

  const priceNode = figma.createText();
  priceNode.name = "price";
  priceNode.fontName = { family: "Inter", style: "Bold" };
  priceNode.fontSize = 14;
  priceNode.characters = "$0.00";

  const ratingNode = figma.createText();
  ratingNode.name = "rating";
  ratingNode.fontName = { family: "Inter", style: "Medium" };
  ratingNode.fontSize = 11;
  ratingNode.characters = "★ 0.0";
  ratingNode.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.65, b: 0.15 } }];

  footerRow.appendChild(priceNode);
  footerRow.appendChild(ratingNode);

  card.appendChild(imageNode);
  card.appendChild(categoryNode);
  card.appendChild(nameNode);
  card.appendChild(footerRow);

  return card;
}

// Data gen

function generateMockData(schema: string, count: number): Array<Record<string, any>> {
  const records = [];

  for (let i = 0; i < count; i++) {
    if (schema === 'user_profile') {
      records.push({
        name: faker.person.fullName(),
        role: faker.person.jobTitle(), // Fixed typo: 'role' instead of 'roler'
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number(),
        city: faker.location.city()
      });
    } else if (schema === 'product_catalog') {
      records.push({
        name: faker.commerce.productName(),
        price: `$${faker.commerce.price({ min: 10, max: 250 })}`,
        category: faker.commerce.department(),
        sku: faker.string.alphanumeric({ length: 8, casing: 'upper' }),
        rating: `★ ${(faker.number.float({ min: 3.5, max: 5.0 })).toFixed(1)}`
      });
    } else if (schema === 'financial_table') {
      records.push({
        id: `TXN-${faker.string.numeric(6)}`,
        amount: `$${faker.finance.amount({ min: 5, max: 1500, dec: 2 })}`,
        status: faker.helpers.arrayElement(["Completed", "Pending", "Failed", "Refunded"]),
        date: faker.date.recent().toISOString().split('T')[0]
      });
    }
  }

  return records;
}

function getAvatarUrl(style: string, seed: string, index: number = 0): string {
  if (style === 'photo' || style === 'pravatar') {
    // Real face portraits by index (no API key needed)
    const avatarId = (index % 70) + 1;
    return `https://i.pravatar.cc/300?img=${avatarId}`;
  }

  if (style === 'picsum') {
    // Random general stock photos
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/300/300`;
  }

  // DiceBear vector illustrations
  const validDicebearStyles = ['avataaars', 'bottts', 'lorelei', 'notionists'];
  const selectedStyle = validDicebearStyles.includes(style) ? style : 'avataaars';

  return `https://api.dicebear.com/7.x/${selectedStyle}/png?seed=${encodeURIComponent(seed)}`;
}

async function generateMockDataWithAvatars(
  schema: string, 
  count: number,
  msgPayLoad?:any
): Promise<Record<string, any>[]> {
  const records: Record<string, any>[] = [];
  const avatarStyle = msgPayLoad?.avatarStyle || 'photo';
  for (let i = 0; i < count; i++) {
    if (schema === 'user_profile') {
      const seed = `BatchUser_${i}_${Date.now()}`;
      const avatarUrl = getAvatarUrl(avatarStyle, seed);
      const avatarBytes = await fetchImageViaUI(avatarUrl);
      
      records.push({
        name: faker.person.fullName(),
        role: faker.person.jobTitle(),
        email: faker.internet.email().toLowerCase(),
        avatar: avatarBytes,
        image: avatarBytes
      });
    }
  }
  return records;
}

function fetchImageViaUI(url: string): Promise<Uint8Array | null> {
  return new Promise((resolve) => {
    const requestId = Math.random().toString(36).substring(7);
    const originalOnMessage = figma.ui.onmessage;

    figma.ui.onmessage = (msg: any, props: OnMessageProperties) => {
      if (
        (msg.type === 'FETCH_IMAGE_SUCCESS' || msg.type === 'FETCH_IMAGE_ERROR') &&
        msg.requestId === requestId
      ) {
        figma.ui.onmessage = originalOnMessage;

        if (msg.type === 'FETCH_IMAGE_SUCCESS') {
          resolve(new Uint8Array(msg.bytes));
        } else {
          resolve(null);
        }
      }

      if (originalOnMessage) {
        originalOnMessage(msg, props);
      }
    };

    figma.ui.postMessage({
      type: 'FETCH_IMAGE',
      url: url,
      requestId: requestId
    });
  });
}

function setNodeImage(node: SceneNode, bytes: Uint8Array) {
  if ("fills" in node) {
    const image = figma.createImage(bytes);
    const currentFills = (node.fills !== figma.mixed && Array.isArray(node.fills))
      ? [...node.fills]
      : [];

    const imagePaint: ImagePaint = { 
      type: 'IMAGE', 
      scaleMode: 'FILL',
      imageHash: image.hash 
    };

    const existingImgIdx = currentFills.findIndex(f => f.type === 'IMAGE');
    if (existingImgIdx >= 0) {
      currentFills[existingImgIdx] = imagePaint;
    } else {
      currentFills.push(imagePaint);
    }

    node.fills = currentFills as Paint[];
  }
}

async function setNodeText(node: TextNode, text: string) {
  if (node.fontName === figma.mixed) {
    const font = node.getRangeFontName(0, 1) as FontName;
    await figma.loadFontAsync(font);
  } else {
    await figma.loadFontAsync(node.fontName as FontName);
  }
  node.characters = String(text);
}

async function populateContainer(container: SceneNode, data: Record<string, any>) {
  if (container.type === "INSTANCE") {
    const props = container.componentProperties;
    for (const [propName, propVal] of Object.entries(props)) {
      const cleanPropName = propName.split('#')[0].toLowerCase().trim();
      for (const [key, val] of Object.entries(data)) {
        if (cleanPropName === key.toLowerCase() && typeof val === "string") {
          if (propVal.type === 'TEXT') {
            container.setProperties({ [propName]: val });
          } else if (propVal.type === 'VARIANT') {
            const mainComp = await container.getMainComponentAsync();
            if (mainComp && mainComp.parent?.type === 'COMPONENT_SET') {
              const options = mainComp.parent.componentPropertyDefinitions[cleanPropName]?.variantOptions;
              if (options?.includes(val)) {
                container.setProperties({ [propName]: val });
              }
            }
          }
        }
      }
    }
  }

  const targetNodes: SceneNode[] = [container];
  if ("findAll" in container) {
    targetNodes.push(...container.findAll(() => true));
  }

  for (const node of targetNodes) {
    const layerName = node.name.toLowerCase().trim();

    for (const [key, value] of Object.entries(data)) {
      if (layerName.includes(key.toLowerCase())) {
        if (node.type === "TEXT" && typeof value === "string") {
          await setNodeText(node, value);
          configureTextNode(node); // <--- STEP 2 APPLIED HERE
        } else if (value instanceof Uint8Array && node.type !== "TEXT") {
          setNodeImage(node, value);
        }
      }
    }
  }
}

function positionOnCanvas(node: SceneNode) {
  node.x = figma.viewport.center.x - node.width / 2;
  node.y = figma.viewport.center.y - node.height / 2;
  figma.currentPage.appendChild(node);
  figma.currentPage.selection = [node];
  figma.viewport.scrollAndZoomIntoView([node]);
}


// Handlers

async function handleBatchCreateComponents(schema: string, count: number, msgPayLoad?: any) {
  try {
    figma.notify(`Generating batch of ${count} ${schema} items...`);

    const selection = figma.currentPage.selection;
    let blueprintNode: FrameNode | ComponentNode | null = null;

    if (selection.length > 0 && ("clone" in selection[0])) {
      blueprintNode = selection[0] as FrameNode | ComponentNode;
    }

    const cardGap = 16;
    const padding = 20;
    const viewportWidth = figma.viewport.bounds.width;
    const targetGridWidth = Math.max(360, Math.min(1080, viewportWidth * 0.65));

  // Parent Grid Container 
    const parentGrid = figma.createFrame();
    parentGrid.name = `${schema === 'user_profile' ? 'User' : 'Product'} Batch Grid`;

    parentGrid.layoutMode = "HORIZONTAL";
    parentGrid.layoutWrap = "WRAP";
    parentGrid.itemSpacing = cardGap;
    parentGrid.counterAxisSpacing = cardGap;
    parentGrid.counterAxisAlignItems = "MIN"; 

    parentGrid.paddingLeft = padding;
    parentGrid.paddingRight = padding;
    parentGrid.paddingTop = padding;
    parentGrid.paddingBottom = padding;

    parentGrid.resize(targetGridWidth, 100);
    
    // Set height to automatically wrap and hug content
    if ('layoutSizingVertical' in parentGrid) {
      parentGrid.layoutSizingVertical = "HUG";
      parentGrid.primaryAxisSizingMode = "FIXED";
    } else {
      (parentGrid as any).counterAxisSizingMode = "AUTO";
      (parentGrid as any).primaryAxisSizingMode = "FIXED";
    }

    parentGrid.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.99 } }];
    parentGrid.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.92 } }];
    parentGrid.strokeWeight = 1;
    parentGrid.cornerRadius = 12;

    // Generate Mock Records
    const records = generateMockData(schema, count);
    const avatarStyle = msgPayLoad?.avatarStyle || 'photo';

    for (let i = 0; i < count; i++) {
      const seed = `BatchUser_${i}_${Date.now()}`;
      const imageUrl = schema === 'user_profile'
        ? getAvatarUrl(avatarStyle, seed)
        : 'https://picsum.photos/300/300';

      const imageBytes = await fetchImageViaUI(imageUrl);
      if (imageBytes && records[i]) {
        records[i].avatar = imageBytes;
        records[i].image = imageBytes;
      }
    }

    // Instantiate and Lock Card Widths
    const CARD_FIXED_WIDTH = blueprintNode ? blueprintNode.width : (schema === 'user_profile' ? 240 : 220);

    for (let i = 0; i < count; i++) {
      let cardInstance: FrameNode;

      if (blueprintNode) {
        cardInstance = blueprintNode.clone() as FrameNode;
      } else {
        cardInstance = schema === 'user_profile' 
          ? await buildDefaultUserCardNode() 
          : await buildDefaultProductCardNode();
      }

      await populateContainer(cardInstance, records[i]);

      // Lock card dimensions so wrapped items don't stretch (Fixes bottom row flex bug)
      cardInstance.resize(CARD_FIXED_WIDTH, cardInstance.height);
      
      if ('layoutSizingHorizontal' in cardInstance) {
        cardInstance.layoutSizingHorizontal = "FIXED";
        cardInstance.layoutSizingVertical = "HUG";
      } else {
        (cardInstance as any).layoutGrow = 0; // Prevent expansion on wrap
      }

      parentGrid.appendChild(cardInstance);
    }

    positionOnCanvas(parentGrid);
    figma.notify(`Successfully created ${count} batch items!`);

  } catch (err) {
    console.error("Batch Creation Failed:", err);
    figma.notify(`Failed to generate batch: ${err}`, { error: true });
  }
}

async function handlePopulateSelection(schema: string, count: number) {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.notify("Please select one or more layers on canvas to populate.", { error: true });
    return;
  }

  figma.notify(`Populating selection with ${count} ${schema} record(s)...`);
  const records = generateMockData(schema, count);

  for (let i = 0; i < Math.min(count, selection.length); i++) {
    const imageUrl = schema === 'user_profile'
      ? `https://api.dicebear.com/7.x/avataaars/png?seed=UserPopulate${i}`
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';

    const imageBytes = await fetchImageViaUI(imageUrl);
    if (imageBytes && records[i]) {
      records[i].avatar = imageBytes;
      records[i].image = imageBytes;
    }

    await populateContainer(selection[i], records[i]);
  }

  figma.notify("Finished populating selected items!");
}

async function handleAddTableRows(count: number) {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.notify("Please select a Data Table or row to append to.", { error: true });
    return;
  }

  let tableFrame: FrameNode | null = null;
  const targetNode = selection[0];

  if ("children" in targetNode && targetNode.name.toLowerCase().includes("table")) {
    tableFrame = targetNode as FrameNode;
  } else if (targetNode.parent && "children" in targetNode.parent) {
    tableFrame = targetNode.parent as FrameNode;
  }

  if (!tableFrame) {
    figma.notify("Could not locate a parent table container.", { error: true });
    return;
  }

  const existingRows = tableFrame.children.filter(child => 
    child.name.toLowerCase().includes("row") && !child.name.toLowerCase().includes("header")
  );

  if (existingRows.length === 0) {
    figma.notify("No template data row found in table to clone.", { error: true });
    return;
  }

  const blueprintRow = existingRows[existingRows.length - 1] as FrameNode;
  const newRecords = generateMockData('financial_table', count);

  for (let i = 0; i < count; i++) {
    const newRow = blueprintRow.clone() as FrameNode;
    newRow.name = `Table Row ${existingRows.length + i + 1}`;
    await populateContainer(newRow, newRecords[i]);
    tableFrame.appendChild(newRow);
  }

  figma.notify(`Appended ${count} row(s) to ${tableFrame.name}!`);
}

async function handleApplyCustomJson(dataArray: any[]) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    figma.notify("Please provide a valid, non-empty JSON array.", { error: true });
    return;
  }

  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify("Please select target nodes on the canvas to apply custom JSON.", { error: true });
    return;
  }

  for (let i = 0; i < Math.min(dataArray.length, selection.length); i++) {
    await populateContainer(selection[i], dataArray[i]);
  }

  figma.notify(`Applied custom JSON to ${Math.min(dataArray.length, selection.length)} item(s)!`);
}

// Msg router

figma.ui.onmessage = async (msg: any, props?: any) => {
  try {
    if (msg.type === 'CREATE_TEMPLATE_CARD') {
      await createUserComponent();
    } else if (msg.type === 'RESIZE_WINDOW') {
      figma.ui.resize(msg.width, msg.height);
    } else if (msg.type === 'CREATE_TEMPLATE_PRODUCT') {
      await createProductComponent();
    } else if (msg.type === 'CREATE_TEMPLATE_TABLE') {
      await createTableComponent(msg.rowCount || 5);
    } else if (msg.type === 'ADD_TABLE_ROWS') {
      await handleAddTableRows(msg.count || 3);
    } else if (msg.type === 'GENERATE_CUSTOM_DATA') {
      await handlePopulateSelection(msg.schema || 'user_profile', msg.count || 5);
    } else if (msg.type === 'BATCH_CREATE_COMPONENTS') {
      // Pass msg as the 3rd argument so avatarStyle and imageProvider are accessible
      await handleBatchCreateComponents(
        msg.schema || 'user_profile', 
        msg.count || 6, 
        msg
      );
    } else if (msg.type === 'APPLY_CUSTOM_JSON') {
      await handleApplyCustomJson(msg.data || []);
    }
  } catch (err) {
    console.error("Error executing command:", err);
    figma.notify(`Plugin Error: ${err}`, { error: true });
  }
};