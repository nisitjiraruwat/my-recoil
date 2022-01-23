import { atomFamily, selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil'

const todoListState = atomFamily<string[], string>({
  key: 'todoListState',
  default: []
})

const myMultipliedState = selectorFamily<number, string>({
  key: 'MyMultipliedNumber',
  get: (id) => ({get}) => {
    return get(todoListState(id)).length
  }
})

const useTodiList = (id: string) => {

  const todoList = useRecoilValue(todoListState(id))
  const setTodoList = useSetRecoilState(todoListState(id))
  const todoLength = useRecoilValue(myMultipliedState(id))

  const addItem = (inputValue: string) => {
    setTodoList((oldTodoList: string[]) => [
      ...oldTodoList,
      inputValue,
    ])
  }

  return {
    todoList,
    addItem,
    todoLength
  }
}

export default useTodiList
