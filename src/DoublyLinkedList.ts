class DoublyLinkedNode<T> {
	public data: T
	public prev: null | DoublyLinkedNode<T>
	public next: null | DoublyLinkedNode<T>

	constructor(data: T) {
		this.data = data
		this.prev = null
		this.next = null
	}
}

export class DoublyLinkedList<T> {
	public first: DoublyLinkedNode<T> | null

	constructor() {
		this.first = null
	}

	add(data: T): DoublyLinkedNode<T> {
		const new_node = new DoublyLinkedNode<T>(data)
		if (this.first) {
			let current = this.first
			while (current.next) {
				current = current.next
			}
			current.next = new_node
			new_node.prev = current
		} else {
			this.first = new_node
		}
		return new_node
	}
}
