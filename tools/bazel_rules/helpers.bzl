"This file contains helper functions that can be used across the rules"

def filter_files(input, endings = [".js"]):
    """Filters a list of files for specific endings

    Args:
        input: The depset or list of files
        endings: The list of endings that should be filtered for

    Returns:
        Returns the filtered list of files
    """

    # Convert input into list regardles of being a depset or list
    input_list = input.to_list() if type(input) == "depset" else input
    filtered = []

    for file in input_list:
        for ending in endings:
            if file.path.endswith(ending):
                filtered.append(file)
                continue

    return filtered

def join(array, seperator = "/"):
    """Joins a string by its seperator (/) used for path merging

    Args:
        array: Array that should be joined
        seperator: The seperator that should be used for joining default "/"

    Returns:
        Returns the joined path
    """
    return seperator.join([p for p in array if p])
