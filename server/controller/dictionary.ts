//

import {
  Controller,
  GetRequest,
  GetResponse,
  PostRequest,
  PostResponse
} from "/server/controller/controller";
import {
  verifyDictionary,
  verifyUser
} from "/server/controller/middle";
import {
  SERVER_PATH
} from "/server/controller/type";
import {
  SlimeDictionaryModel,
  SlimeDictionarySkeleton,
  SlimeWordSkeleton
} from "/server/model/dictionary/slime";
import {
  CustomErrorSkeleton
} from "/server/model/error";
import {
  before,
  controller,
  get,
  post
} from "/server/util/decorator";


@controller("/")
export class DictionaryController extends Controller {

  @post(SERVER_PATH["dictionaryCreate"])
  @before(verifyUser())
  public async postCreate(request: PostRequest<"dictionaryCreate">, response: PostResponse<"dictionaryCreate">): Promise<void> {
    let user = request.user!;
    let name = request.body.name;
    let dictionary = await SlimeDictionaryModel.createEmpty(name, user);
    let body = new SlimeDictionarySkeleton(dictionary);
    response.json(body);
  }

  @post(SERVER_PATH["dictionaryUpload"])
  @before(verifyUser(), verifyDictionary())
  public async postUpload(request: PostRequest<"dictionaryUpload">, response: PostResponse<"dictionaryUpload">): Promise<void> {
    let dictionary = request.dictionary!;
    let path = request.file.path;
    let nextDictionary = await dictionary.upload(path);
    let body = new SlimeDictionarySkeleton(nextDictionary);
    response.json(body);
  }

  @get(SERVER_PATH["dictionarySearch"])
  public async getSearch(request: GetRequest<"dictionarySearch">, response: GetResponse<"dictionarySearch">): Promise<void> {
    let number = parseInt(request.query.number, 10);
    let search = request.query.search;
    let mode = request.query.mode;
    let type = request.query.type;
    let offset = parseInt(request.query.offset, 10) || 0;
    let size = parseInt(request.query.size, 10) || 0;
    let dictionary = await SlimeDictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let words = await dictionary.search(search, mode, type, offset, size);
      let body = words.map((word) => new SlimeWordSkeleton(word));
      response.json(body);
    } else {
      let body = new CustomErrorSkeleton("invalidNumber");
      response.status(400).json(body);
    }
  }

  @get(SERVER_PATH["dictionaryInfo"])
  public async getInfo(request: GetRequest<"dictionaryInfo">, response: GetResponse<"dictionaryInfo">): Promise<void> {
    let number = parseInt(request.query.number, 10);
    let dictionary = await SlimeDictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let body = new SlimeDictionarySkeleton(dictionary);
      response.json(body);
    } else {
      let body = new CustomErrorSkeleton("invalidNumber");
      response.status(400).json(body);
    }
  }

  @get(SERVER_PATH["dictionaryList"])
  @before(verifyUser())
  public async getList(request: GetRequest<"dictionaryList">, response: GetResponse<"dictionaryList">): Promise<void> {
    let user = request.user!;
    let dictionaries = await SlimeDictionaryModel.findByUser(user);
    let promises = dictionaries.map((dictionary) => {
      let promise = new Promise<SlimeDictionarySkeleton>(async (resolve, reject) => {
        try {
          let skeleton = new SlimeDictionarySkeleton(dictionary);
          await skeleton.fetch(dictionary);
          resolve(skeleton);
        } catch (error) {
          reject(error);
        }
      });
      return promise;
    });
    let body = await Promise.all(promises);
    response.json(body);
  }

  @get(SERVER_PATH["dictionaryListAll"])
  public async getListAll(request: GetRequest<"dictionaryListAll">, response: GetResponse<"dictionaryListAll">): Promise<void> {
    let dictionaries = await SlimeDictionaryModel.findPublic();
    let promises = dictionaries.map((dictionary) => {
      let promise = new Promise<SlimeDictionarySkeleton>(async (resolve, reject) => {
        try {
          let skeleton = new SlimeDictionarySkeleton(dictionary);
          await skeleton.fetch(dictionary);
          resolve(skeleton);
        } catch (error) {
          reject(error);
        }
      });
      return promise;
    });
    let body = await Promise.all(promises);
    response.json(body);
  }

}