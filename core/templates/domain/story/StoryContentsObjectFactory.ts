// Copyright 2018 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Factory for creating and mutating instances of frontend
 * story contents domain objects.
 */

import { downgradeInjectable } from '@angular/upgrade/static';
import { Injectable } from '@angular/core';

import { StoryEditorPageConstants } from
  'pages/story-editor-page/story-editor-page.constants';
import { StoryNodeBackendDict, StoryNode, StoryNodeObjectFactory } from
  'domain/story/StoryNodeObjectFactory';

export interface StoryContentsBackendDict {
  'initial_node_id': string;
  'next_node_id': string;
  'nodes': StoryNodeBackendDict[];
}

export class StoryContents {
  _initialNodeId: string;
  _nodes: StoryNode[];
  _nextNodeId: string;
  _storyNodeObjectFactoryInstance: StoryNodeObjectFactory;
  constructor(
      initialNodeId: string, nodes: StoryNode[], nextNodeId: string,
      storyNodeObjectFactoryInstance: StoryNodeObjectFactory) {
    this._initialNodeId = initialNodeId;
    this._nodes = nodes;
    this._nextNodeId = nextNodeId;
    this._storyNodeObjectFactoryInstance = storyNodeObjectFactoryInstance;
  }

  getIncrementedNodeId(nodeId: string): string {
    var index = parseInt(
      nodeId.replace(StoryEditorPageConstants.NODE_ID_PREFIX, ''));
    ++index;
    return StoryEditorPageConstants.NODE_ID_PREFIX + index;
  }

  getInitialNodeId(): string {
    return this._initialNodeId;
  }

  getLinearNodesList(): StoryNode[] {
    return this._nodes.slice();
  }

  getNextNodeId(): string {
    return this._nextNodeId;
  }

  getNodes(): StoryNode[] {
    return this._nodes;
  }

  getNodeIdCorrespondingToTitle(title: string): string {
    var nodes = this._nodes;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].getTitle() === title) {
        return nodes[i].getId();
      }
    }
    return null;
  }

  rearrangeNodeInStory(fromIndex, toIndex) {
    const nodeToMove = this._nodes[fromIndex];
    this._nodes.splice(fromIndex, 1);
    this._nodes.splice(toIndex, 0, nodeToMove);
  }

  getNodeIdsToTitleMap(nodeIds: string[]): {} {
    var nodes = this._nodes;
    var nodeTitles = {};
    for (var i = 0; i < nodes.length; i++) {
      if (nodeIds.indexOf(nodes[i].getId()) !== -1) {
        nodeTitles[nodes[i].getId()] = nodes[i].getTitle();
      }
    }
    if (Object.keys(nodeTitles).length !== nodeIds.length) {
      for (var i = 0; i < nodeIds.length; i++) {
        if (!nodeTitles.hasOwnProperty(nodeIds[i])) {
          throw new Error('The node with id ' + nodeIds[i] + ' is invalid');
        }
      }
    }
    return nodeTitles;
  }

  getNodeIds(): string[] {
    return this._nodes.map((node: StoryNode) => {
      return node.getId();
    });
  }

  getNodeIndex(nodeId: string) {
    for (var i = 0; i < this._nodes.length; i++) {
      if (this._nodes[i].getId() === nodeId) {
        return i;
      }
    }
    return -1;
  }

  validate(): string[] {
    var issues: string[] = [];
    var nodes = this._nodes;
    for (var i = 0; i < nodes.length; i++) {
      var nodeIssues = nodes[i].validate();
      issues = issues.concat(nodeIssues);
    }
    if (issues.length > 0) {
      return issues;
    }

    // Provided the nodes list is valid and each node in it is valid, the
    // preliminary checks are done to see if the story node graph obtained is
    // valid.
    var nodeIds = nodes.map((node: StoryNode) => {
      return node.getId();
    });
    var nodeTitles = nodes.map((node: StoryNode) => {
      return node.getTitle();
    });
    for (var i = 0; i < nodeIds.length; i++) {
      var nodeId = nodeIds[i];
      if (nodeIds.indexOf(nodeId) < nodeIds.lastIndexOf(nodeId)) {
        throw new Error(
          'The node with id ' + nodeId + ' is duplicated in the story');
      }
    }
    var nextNodeIdNumber = parseInt(
      this._nextNodeId.replace(StoryEditorPageConstants.NODE_ID_PREFIX, ''));
    var initialNodeIsPresent = false;
    for (var i = 0; i < nodes.length; i++) {
      var nodeIdNumber = parseInt(
        nodes[i].getId().replace(StoryEditorPageConstants.NODE_ID_PREFIX, ''));
      if (nodes[i].getId() === this._initialNodeId) {
        initialNodeIsPresent = true;
      }
      if (nodeIdNumber > nextNodeIdNumber) {
        throw new Error(
          'Node id out of bounds for node with id ' + nodes[i].getId());
      }
    }
    return issues;
  }

  setInitialNodeId(nodeId: string): void {
    if (this.getNodeIndex(nodeId) === -1) {
      throw new Error('The node with given id doesn\'t exist');
    }
    this._initialNodeId = nodeId;
  }

  addNode(title: string): void {
    this._nodes.push(
      this._storyNodeObjectFactoryInstance.createFromIdAndTitle(
        this._nextNodeId, title));
    if (this._initialNodeId === null) {
      this._initialNodeId = this._nextNodeId;
    }
    this._nextNodeId = this.getIncrementedNodeId(this._nextNodeId);
  }

  deleteNode(nodeId: string): void {
    if (this.getNodeIndex(nodeId) === -1) {
      throw new Error('The node does not exist');
    }
    if (nodeId === this._initialNodeId) {
      if (this._nodes.length === 1) {
        this._initialNodeId = null;
      } else {
        throw new Error('Cannot delete initial story node');
      }
    }
    for (var i = 0; i < this._nodes.length; i++) {
      if (this._nodes[i].getDestinationNodeIds().indexOf(nodeId) !== -1) {
        this._nodes[i].removeDestinationNodeId(nodeId);
      }
    }
    this._nodes.splice(this.getNodeIndex(nodeId), 1);
  }

  setNodeOutline(nodeId: string, outline: string): void {
    var index = this.getNodeIndex(nodeId);
    if (index === -1) {
      throw new Error('The node with given id doesn\'t exist');
    }
    this._nodes[index].setOutline(outline);
  }

  setNodeTitle(nodeId: string, title: string): void {
    var index = this.getNodeIndex(nodeId);
    if (index === -1) {
      throw new Error('The node with given id doesn\'t exist');
    }
    this._nodes[index].setTitle(title);
  }

  setNodeDescription(nodeId: string, description: string): void {
    var index = this.getNodeIndex(nodeId);
    if (index === -1) {
      throw new Error('The node with given id doesn\'t exist');
    }
    this._nodes[index].setDescription(description);
  }

  setNodeExplorationId(nodeId: string, explorationId: string): void {
    var index = this.getNodeIndex(nodeId);
    if (index === -1) {
      throw new Error('The node with given id doesn\'t exist');
    } else {
      if (explorationId !== null) {
        for (var i = 0; i < this._nodes.length; i++) {
          if ((this._nodes[i].getExplorationId() === explorationId) && (
            i !== index)) {
            throw new Error(
              'The given exploration already exists in the story.');
          }
        }
      }
      this._nodes[index].setExplorationId(explorationId);
    }
  }

  markNodeOutlineAsFinalized(nodeId: string): void {
    var index = this.getNodeIndex(nodeId);
    if (index === -1) {
      throw new Error('The node with given id doesn\'t exist');
    }
    this._nodes[index].markOutlineAsFinalized();
  }

  markNodeOutlineAsNotFinalized(nodeId: string): void {
    var index = this.getNodeIndex(nodeId);
    if (index === -1) {
      throw new Error('The node with given id doesn\'t exist');
    }
    this._nodes[index].markOutlineAsNotFinalized();
  }

  addPrerequisiteSkillIdToNode(nodeId: string, skillId: string): void {
    var index = this.getNodeIndex(nodeId);
    if (index === -1) {
      throw new Error('The node with given id doesn\'t exist');
    }
    this._nodes[index].addPrerequisiteSkillId(skillId);
  }

  removePrerequisiteSkillIdFromNode(nodeId: string, skillId: string): void {
    var index = this.getNodeIndex(nodeId);
    if (index === -1) {
      throw new Error('The node with given id doesn\'t exist');
    }
    this._nodes[index].removePrerequisiteSkillId(skillId);
  }

  addAcquiredSkillIdToNode(nodeId: string, skillId: string): void {
    var index = this.getNodeIndex(nodeId);
    if (index === -1) {
      throw new Error('The node with given id doesn\'t exist');
    }
    this._nodes[index].addAcquiredSkillId(skillId);
  }

  removeAcquiredSkillIdFromNode(nodeId: string, skillId: string): void {
    var index = this.getNodeIndex(nodeId);
    if (index === -1) {
      throw new Error('The node with given id doesn\'t exist');
    }
    this._nodes[index].removeAcquiredSkillId(skillId);
  }

  addDestinationNodeIdToNode(nodeId: string, destinationNodeId: string): void {
    var index = this.getNodeIndex(nodeId);
    if (index === -1) {
      throw new Error('The node with given id doesn\'t exist');
    }
    if (this.getNodeIndex(destinationNodeId) === -1) {
      throw new Error('The destination node with given id doesn\'t exist');
    }
    this._nodes[index].addDestinationNodeId(destinationNodeId);
  }

  removeDestinationNodeIdFromNode(
      nodeId: string, destinationNodeId: string): void {
    var index = this.getNodeIndex(nodeId);
    if (index === -1) {
      throw new Error('The node with given id doesn\'t exist');
    }
    this._nodes[index].removeDestinationNodeId(destinationNodeId);
  }
}

@Injectable({
  providedIn: 'root'
})
export class StoryContentsObjectFactory {
  constructor(private storyNodeObjectFactory: StoryNodeObjectFactory) {}
  createFromBackendDict(
      storyContentsBackendObject: StoryContentsBackendDict): StoryContents {
    var nodes = [];
    for (var i = 0; i < storyContentsBackendObject.nodes.length; i++) {
      nodes.push(
        this.storyNodeObjectFactory.createFromBackendDict(
          storyContentsBackendObject.nodes[i]));
    }
    return new StoryContents(
      storyContentsBackendObject.initial_node_id, nodes,
      storyContentsBackendObject.next_node_id,
      this.storyNodeObjectFactory);
  }
}

angular.module('oppia').factory(
  'StoryContentsObjectFactory',
  downgradeInjectable(StoryContentsObjectFactory));
